import {CommonQueryMethods, NotFoundError, sql} from "slonik";
import {Entity, EntityLike, Guard} from "@/types";
import {convertToIdentifiers} from "@/utils/sql";
import {isKeyOf} from "@/utils/entity";
import assertThat from "@/utils/assert-that";
import {RequestError} from "@/errors";

type WithId<T> = T & { id: string };

export const buildFindEntityByIdWithPool =
    (pool: CommonQueryMethods) =>
        <
            S extends WithId<T>,
            T extends EntityLike<S>
        >(
            entity: Entity<T>,
            guard: Guard<T>
        ) => {
            const {table, fields} = convertToIdentifiers(entity);
            const isKeyOfEntity = isKeyOf(entity);

            // check sure id is key of the entity
            assertThat(isKeyOfEntity('id'), 'entity.not_exists');

            return async (id: string) => {
                try {
                    return await pool.one(sql.type(guard)`
                        select ${sql.join(Object.values(fields), sql.fragment`, `)}
                        from ${table}
                        where ${fields.id} = ${id}
                    `)
                } catch (error: unknown) {
                    if (error instanceof NotFoundError) {
                        throw new RequestError({
                            code: 'entity.not_exists_with_id',
                            name: entity.table,
                            id,
                            status: 404
                        })
                    }
                    throw error;
                }
            }
        }

export const buildFindEntitiesByIdsWithPool =
    (pool: CommonQueryMethods) =>
        <
            S extends WithId<T>,
            T extends EntityLike<S>
        >(
            entity: Entity<T>,
            guard: Guard<T>
        ) => {
            const {table, fields} = convertToIdentifiers(entity)
            const isKeyOfEntity = isKeyOf(entity);

            // check sure id is key of the entity
            assertThat(isKeyOfEntity('id'), 'entity.not_exists');

            return async (ids: string[]) =>
                pool.any(sql.type(guard)`
                select ${sql.join(Object.values(fields), sql.fragment`, `)}
                from ${table}
                where ${fields.id} in (${ids.length > 0 ? sql.join(ids, sql.fragment`, `): sql.fragment`null`})
                `)
        }