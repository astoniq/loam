import {Entity, EntityLike, EntityValue, EntityGuard, UpdateWhereData} from "@/types/index.js";
import {CommonQueryMethods, sql} from "slonik";
import {conditionalSql, convertToIdentifiers, convertToPrimitiveOrSql} from "@/utils/sql.js";
import {isKeyOf} from "@/utils/entity.js";
import {notFalsy, Truthy} from "@astoniq/essentials";
import assertThat from "@/utils/assert-that.js";
import {UpdateError} from "@/errors/index.js";

type BuildUpdateWhere = {
    <T extends EntityLike<T>>
    (entity: Entity<T>, guard: EntityGuard<T>): (data: UpdateWhereData<T, T>) => Promise<T>;
}

export const buildUpdateWhereWithPool =
    (pool: CommonQueryMethods): BuildUpdateWhere =>
        <T extends EntityLike<T>>
        (
            entity: Entity<T>,
            guard: EntityGuard<T>,
        ) => {
            const {fields, table} = convertToIdentifiers(entity);
            const isKeyOfSchema = isKeyOf(entity);

            const connectKeyValueWithEqualSign = <T>(data: Partial<EntityLike<T>>) =>
                Object.entries<EntityValue>(data)
                    .map(([key, value]) => {
                        if (!isKeyOfSchema(key) || value === undefined) {
                            return;
                        }

                        return sql.fragment`${fields[key]}=${convertToPrimitiveOrSql(key, value)}`
                    })
                    .filter((value): value is Truthy<typeof value> => notFalsy(value));

            return async ({set, where}: UpdateWhereData<T, T>) => {
                const {
                    rows: [data]
                } = await pool.query(sql.type(guard)`
                            update ${table}
                            set ${sql.join(connectKeyValueWithEqualSign(set), sql.fragment`, `)}
                            where ${sql.join(connectKeyValueWithEqualSign(where), sql.fragment` and `)}
                                      ${conditionalSql(true, () => sql.fragment`returning *`)}
                    `
                );
                assertThat(data, new UpdateError(entity, {set, where}));

                return data;
            }
        }