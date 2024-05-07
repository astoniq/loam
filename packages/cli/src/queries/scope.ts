import {CommonQueryMethods, sql} from "slonik";
import {scopeGuard} from "@astoniq/loam-schemas";
import {conditionalSql, convertToIdentifiers} from "@/utils/sql.js";
import {scopeEntity} from "@/entities/index.js";

const {table, fields} = convertToIdentifiers(scopeEntity)

export const createScopeQueries = (pool: CommonQueryMethods) => {

    const findScopesByResourceId = async (resourceId: string) => {
        return pool.any(sql.type(scopeGuard)`
            select ${sql.join(Object.values(fields), sql.fragment`, `)}
            from ${table}
            where ${fields.resourceId} = ${resourceId}
        `)
    }

    const findScopeByNameAndResourceId = async (
        name: string,
        resourceId: string,
        excludeScopeId?: string
    ) => {
        return pool.maybeOne(sql.type(scopeGuard)`
            select ${sql.join(Object.values(fields), sql.fragment`, `)}
            from ${table}
            where ${fields.resourceId} = ${resourceId}
              and ${fields.name} = ${name}
                ${conditionalSql(excludeScopeId, id => sql.fragment`and ${fields.id}<>${id}`)}
        `)
    }

    return {
        findScopesByResourceId,
        findScopeByNameAndResourceId
    }
}