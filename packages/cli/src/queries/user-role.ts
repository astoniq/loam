import {CommonQueryMethods, sql} from "slonik";
import {userRoleGuard} from "@astoniq/loam-schemas";
import {convertToIdentifiers} from "@/utils/sql.js";
import {userRoleEntity} from "@/entities/index.js";

const {table, fields} = convertToIdentifiers(userRoleEntity)

export const createUserRoleQueries = (pool: CommonQueryMethods) => {
    const findUserRolesByUserId = async (userId: string) => {
        return pool.any(sql.type(userRoleGuard)`
            select ${sql.join(Object.values(fields), sql.fragment`,`)}
            from ${table}
            where ${fields.userId} = ${userId}
        `)
    }

    return {
        findUserRolesByUserId
    }
}