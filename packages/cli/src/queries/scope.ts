import {CommonQueryMethods, sql} from "slonik";
import {scopeGuard} from "@astoniq/loam-schemas";
import {convertToIdentifiers} from "@/utils/sql.js";
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

    return {
        findScopesByResourceId
    }
}