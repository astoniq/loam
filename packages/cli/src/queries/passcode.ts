import {CommonQueryMethods, sql} from "slonik";
import {conditionalSql, convertToIdentifiers} from "@/utils/sql.js";
import {passcodeEntity} from "@/entities/index.js";
import {passcodeGuard, RequestVerificationCodePayload} from "@astoniq/loam-schemas";
import {TemplateType} from "@astoniq/loam-connector-kit";
import {buildInsertIntoWithPool} from "@/database/index.js";
import {DeletionError} from "@/errors/index.js";

const {table, fields} = convertToIdentifiers(passcodeEntity);

type FindByIdentifierAndTypeProperties = {
    type: TemplateType;
} & RequestVerificationCodePayload;

const buildSqlForFindByJtiAndType = (jti: string, type: TemplateType) => sql.type(passcodeGuard)`
    select ${sql.join(Object.values(fields), sql.fragment`, `)}
    from ${table}
    where ${fields.interactionJti} = ${jti}
      and ${fields.type} = ${type}
      and ${fields.consumed} = false
`;

const buildSqlForFindByIdentifierAndType = ({
                                                type,
                                                ...identifier
                                            }: FindByIdentifierAndTypeProperties) => sql.type(passcodeGuard)`
    select ${sql.join(Object.values(fields), sql.fragment`, `)}
    from ${table}
    where ${conditionalSql(
            'email' in identifier && identifier.email,
            (email) => sql.fragment`${fields.email}=${email}`
    )}
      and ${fields.type} = ${type}
      and ${fields.consumed} = false
`;

export const createPasscodeQueries = (pool: CommonQueryMethods) => {

    const findUnconsumedPasscodeByJtiAndType = async (jti: string, type: TemplateType) =>
        pool.maybeOne(buildSqlForFindByJtiAndType(jti, type));

    const findUnconsumedPasscodesByJtiAndType = async (jti: string, type: TemplateType) =>
        pool.any(buildSqlForFindByJtiAndType(jti, type));

    const findUnconsumedPasscodeByIdentifierAndType = async (
        properties: FindByIdentifierAndTypeProperties
    ) => pool.maybeOne(buildSqlForFindByIdentifierAndType(properties));


    const findUnconsumedPasscodesByIdentifierAndType = async (
        properties: FindByIdentifierAndTypeProperties
    ) => pool.any(buildSqlForFindByIdentifierAndType(properties));


    const insertPasscode = buildInsertIntoWithPool(pool)(passcodeEntity, passcodeGuard, {
        returning: true,
    });

    const consumePasscode = async (id: string) =>
        pool.query(sql.type(passcodeGuard)`
            update ${table}
            set ${fields.consumed}= true
            where ${fields.id} = ${id}
            returning ${sql.join(Object.values(fields), sql.fragment`, `)}
        `);

    const increasePasscodeTryCount = async (id: string) =>
        pool.query(sql.type(passcodeGuard)`
            update ${table}
            set ${fields.tryCount}=${fields.tryCount} + 1
            where ${fields.id} = ${id}
            returning ${sql.join(Object.values(fields), sql.fragment`, `)}
        `);

    const deletePasscodeById = async (id: string) => {
        const {rowCount} = await pool.query(sql.unsafe`
            delete
            from ${table}
            where ${fields.id} = ${id}
        `);

        if (rowCount < 1) {
            throw new DeletionError(passcodeEntity.table, id);
        }
    };

    const deletePasscodesByIds = async (ids: string[]) => {
        const {rowCount} = await pool.query(sql.unsafe`
            delete
            from ${table}
            where ${fields.id} in (${sql.join(ids, sql.fragment`,`)})
        `);

        if (rowCount !== ids.length) {
            throw new DeletionError(passcodeEntity.table, `${ids.join(',')}`);
        }
    };

    return {
        findUnconsumedPasscodeByJtiAndType,
        findUnconsumedPasscodesByJtiAndType,
        findUnconsumedPasscodeByIdentifierAndType,
        findUnconsumedPasscodesByIdentifierAndType,
        insertPasscode,
        consumePasscode,
        increasePasscodeTryCount,
        deletePasscodeById,
        deletePasscodesByIds,
    };
}
