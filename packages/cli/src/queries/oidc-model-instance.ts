import {CommonQueryMethods, sql, ValueExpression} from "slonik";
import {buildInsertIntoWithPool} from "@/database/index.js";
import {oidcModelInstanceEntity} from "@/entities/index.js";
import {convertToIdentifiers, convertToTimestamp} from "@/utils/sql.js";
import {conditional, Nullable} from "@astoniq/essentials";
import {addSeconds, isBefore} from 'date-fns';
import {
    oidcModelInstanceGuard,
    OidcModelInstancePayload,
    OidcModelInstanceQueryResult,
    oidcModelInstanceQueryResultGuard
} from "@astoniq/loam-schemas";

const {table, fields} = convertToIdentifiers(oidcModelInstanceEntity)

const refreshTokenReuseInterval = 3;

export type WithConsumed<T> = T & { consumed?: boolean };

const isConsumed = (modelName: string, consumedAt: Nullable<number>): boolean => {
    if (!consumedAt) {
        return false;
    }

    if (modelName !== 'RefreshToken') {
        return Boolean(consumedAt);
    }

    return isBefore(addSeconds(consumedAt, refreshTokenReuseInterval), Date.now());
};

const withConsumed = <T>(
    data: T,
    modelName: string,
    consumedAt: Nullable<number>
): WithConsumed<T> => ({
    ...data,
    ...(isConsumed(modelName, consumedAt) ? {consumed: true} : undefined),
});

const findByModel = (modelName: string) => sql.fragment`
    select ${fields.payload}, ${fields.consumedAt}
    from ${table}
    where ${fields.modelName} = ${modelName}`

const convertResult = (result: OidcModelInstanceQueryResult | null, modelName: string) =>
    conditional(result && withConsumed(result.payload, modelName, result.consumedAt))

export const createOidcModelInstanceQueries = (pool: CommonQueryMethods) => {

    const upsertInstance = buildInsertIntoWithPool(pool)(oidcModelInstanceEntity,
        oidcModelInstanceGuard,
        {
            onConflict: {
                fields: [fields.modelName, fields.id],
                setExcludedFields: [fields.payload, fields.expiresAt]
            }
        })

    const findPayloadById = async (modelName: string, id: string) => {
        const result = await pool.maybeOne(
            sql.type(oidcModelInstanceQueryResultGuard)`${findByModel(modelName)} and ${fields.id}=${id}`)
        return convertResult(result, modelName)
    }

    const findPayloadByPayloadField = async <
        T extends ValueExpression,
        Field extends keyof OidcModelInstancePayload>
    (
        modelName: string,
        field: Field,
        value: T
    ) => {
        const result = await pool.maybeOne(
            sql.type(oidcModelInstanceQueryResultGuard)`${findByModel(modelName)} and ${fields.payload}->>${field}=${value}`
        );

        return convertResult(result, modelName)
    }

    const consumeInstanceById = async (modelName: string, id: string) => {
        await pool.query(sql.unsafe`
            update ${table}
            set ${fields.consumedAt}=${convertToTimestamp()}
            where ${fields.modelName} = ${modelName}
              and ${fields.id} = ${id}`)
    }

    const destroyInstanceById = async (modelName: string, id: string) => {
        await pool.query(sql.unsafe`
            delete
            from ${table}
            where ${fields.modelName} = ${modelName}
              and ${fields.id} = ${id}`)
    }

    const revokeInstanceByGrantId = async (modelName: string, grantId: string) => {
        await pool.query(sql.unsafe`
            delete
            from ${table}
            where ${fields.modelName} = ${modelName}
              and ${fields.payload} ->> 'grantId' = ${grantId}
        `);
    }

    const revokeInstanceByUserId = async (modelName: string, userId: string) => {
        await pool.query(sql.unsafe`
            delete
            from ${table}
            where ${fields.modelName} = ${modelName}
              and ${fields.payload} ->> 'accountId' = ${userId}
        `);
    };

    return {
        upsertInstance,
        findPayloadById,
        findPayloadByPayloadField,
        consumeInstanceById,
        destroyInstanceById,
        revokeInstanceByGrantId,
        revokeInstanceByUserId,
    };
}