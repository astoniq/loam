import {CommonQueryMethods, sql} from "slonik";
import {convertToIdentifiers} from "@/utils/sql.js";
import {resourceEntity} from "@/entities/index.js";
import {buildFindAllEntitiesWithPool, buildFindEntityByIdWithPool} from "@/database/index.js";
import {resourceGuard} from "@astoniq/loam-schemas";

export const createResourceQueries = (pool: CommonQueryMethods) => {

    const {table, fields} = convertToIdentifiers(resourceEntity);

    const findAllResources = buildFindAllEntitiesWithPool(pool)(resourceEntity, resourceGuard)

    const findResourceById = buildFindEntityByIdWithPool(pool)(resourceEntity, resourceGuard)

    const findResourceByIds = async (resourceIds: string[]) =>
        resourceIds.length > 0
            ? pool.any(sql.type(resourceGuard)`
                    select ${sql.join(Object.values(fields), sql.fragment`, `)}
                    from ${table}
                    where ${fields.id} in (${sql.join(resourceIds, sql.fragment`, `)})
            `)
            : [];

    const findResourceByIndicator = async (indicator: string) => {
        return pool.maybeOne(sql.type(resourceGuard)`
            select ${sql.join(Object.values(fields), sql.fragment`,`)}
            from ${table}
            where ${fields.indicator} = ${indicator}
        `)
    }

    return {
        findResourceById,
        findResourceByIds,
        findAllResources,
        findResourceByIndicator
    }
}