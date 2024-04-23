import {conditionalSql, convertToIdentifiers} from "@/utils/sql.js";
import {userEntity} from "@/entities/index.js";
import {CommonQueryMethods, sql} from "slonik";
import {userGuard} from "@astoniq/loam-schemas";

const {table, fields} = convertToIdentifiers(userEntity);

export const createUserQueries = (pool: CommonQueryMethods) => {

    const findUserByUsername = async (username: string) => {
        return pool.maybeOne(sql.type(userGuard)`
            select ${sql.join(Object.values(fields), sql.fragment`,`)}
            from ${table}
            where lower(${fields.username}) = lower(${username})
        `)
    }

    const findUserByEmail = async (email: string) => {
        return pool.maybeOne(sql.type(userGuard)`
            select ${sql.join(Object.values(fields), sql.fragment`,`)}
            from ${table}
            where lower(${fields.primaryEmail}) = lower(${email})
        `)
    }

    const findUserByPhone = async (phone: string) => {
        return pool.maybeOne(sql.type(userGuard)`
            select ${sql.join(Object.values(fields), sql.fragment`,`)}
            from ${table}
            where ${fields.primaryPhone} = ${phone}
        `)
    }

    const findUserById = async (id: string) => {
        return pool.one(sql.type(userGuard)`
            select ${sql.join(Object.values(fields), sql.fragment`,`)}
            from ${table}
            where ${fields.id} = ${id}
        `)
    }

    const hasUser = async (username: string, excludeUserId?: string) => {
        return pool.exists(sql.unsafe`
            select ${fields.id}
            from ${table}
            where lower(${fields.username}) = lower(${username})
                ${conditionalSql(excludeUserId, id => sql.fragment`and ${fields.id}<>${id}`)}
        `)
    }

    const hasUserWithId = async (id: string) => {
        return pool.exists(sql.unsafe`
            select ${fields.id}
            from ${table}
            where ${fields.id} = ${id}
        `)
    }

    const hasUserWithEmail = async (email: string, excludeUserId?: string) => {
        return pool.exists(sql.unsafe`
            select ${fields.primaryEmail}
            from ${table}
            where lower(${fields.primaryEmail}) = lower(${email})
                ${conditionalSql(excludeUserId, id => sql.fragment`and ${fields.id}<>${id}`)}
        `)
    }

    const hasUserWithPhone = async (phone: string, excludeUserId?: string) => {
        return pool.exists(sql.unsafe`
            select ${fields.primaryPhone}
            from ${table}
            where ${fields.primaryPhone} = ${phone}
                ${conditionalSql(excludeUserId, id => sql.fragment`and ${fields.id}<>${id}`)}
        `)
    }

    return {
        findUserByUsername,
        findUserByEmail,
        findUserByPhone,
        findUserById,
        hasUser,
        hasUserWithId,
        hasUserWithEmail,
        hasUserWithPhone
    }
}