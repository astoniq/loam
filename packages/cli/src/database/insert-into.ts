import {CommonQueryMethods, IdentifierSqlToken, sql} from "slonik";
import {
    conditionalSql,
    convertToIdentifiers,
    convertToPrimitiveOrSql,
    excludeAutoSetFields,
    OmitAutoSetFields
} from "@/utils/sql.js";
import {Entity, EntityLike, EntityGuard} from "@/types/index.js";
import assertThat from "@/utils/assert-that.js";
import {InsertionError} from "@/errors/index.js";

type OnConflict = |
    {
        fields: IdentifierSqlToken[],
        setExcludedFields: IdentifierSqlToken[],
        ignore?: false
    } | { ignore: true }

type InsertIntoConfig = {
    onConflict?: OnConflict;
};

type BuildInsertInto = {
    <T extends EntityLike<T>,
        CreateEntity extends Partial<EntityLike<T>>>
    (
        entity: Entity<T>,
        guard: EntityGuard<T>,
        config?: InsertIntoConfig):
        (data: OmitAutoSetFields<CreateEntity>) => Promise<T>;
}

const setExcluded = (...fields: IdentifierSqlToken[]) =>
    sql.join(fields.map((field) => sql.fragment`${field}=excluded.${field}`), sql.fragment`, `)

export const buildInsertIntoWithPool =
    (pool: CommonQueryMethods): BuildInsertInto =>
        <T extends EntityLike<T>,
            CreateEntity extends Partial<EntityLike<T>>>
        (
            entity: Entity<T>,
            guard: EntityGuard<T>,
            config?: InsertIntoConfig) => {

            const {fields, table} = convertToIdentifiers(entity);
            const keys = excludeAutoSetFields(entity);
            const onConflict = config?.onConflict;

            return async (data: OmitAutoSetFields<CreateEntity>): Promise<T> => {
                const insertingKeys = keys.filter((key) => key in data)
                const {
                    rows: [entry]
                } = await pool.query(sql.type(guard)`
                    insert into ${table} (${sql.join(insertingKeys.map((key) => fields[key]), sql.fragment`, `)})
                    values (${sql.join(insertingKeys.map((key) => convertToPrimitiveOrSql(key, data[key] ?? null)), sql.fragment`, `)})
                        ${conditionalSql(onConflict, (config) =>
                                config.ignore ? sql.fragment`on conflict do nothing` :
                                        sql.fragment`on conflict (${sql.join(config.fields, sql.fragment`, `)}) do update
                                set ${setExcluded(...config.setExcludedFields)}`
                        )} ${conditionalSql(true, () => sql.fragment`returning *`)}
                `);

                assertThat(entry, new InsertionError(entity, data));

                return entry;
            }
        }