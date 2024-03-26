import {CommonQueryMethods, sql} from "slonik";
import {convertToIdentifiers} from "@/utils/sql";
import {resourceEntity} from "@/entities";
import {resourceGuard} from "@/guards";
import {buildFindAllEntitiesWithPool} from "@/database";

export const createResourceQueries = (pool: CommonQueryMethods) => {

    const {table, fields} = convertToIdentifiers(resourceEntity);

    const findAllResources = buildFindAllEntitiesWithPool(pool)(resourceEntity, resourceGuard)

    const findResourceByIds = async (resourceIds: string[]) =>
        resourceIds.length > 0
            ? pool.any(sql.type(resourceGuard)`
                    select ${sql.join(Object.values(fields), sql.fragment`, `)}
                    from ${table}
                    where ${fields.id} in (${sql.join(resourceIds, sql.fragment`, `)})
            `)
            : [];

    return {
        findResourceByIds,
        findAllResources
    }
}