import {CommonQueryMethods, IdentifierSqlToken, sql} from "slonik";
import {Entity, EntityLike} from "@/types/index.js";
import {buildSearchSql, SearchOptions} from "@/database/utils.js";
import {countEntityGuard} from "@/guards/index.js";

export const buildGetTotalRowCountWithPool =
    <
        T extends EntityLike<T>
    >(pool: CommonQueryMethods, entity: Entity<T>) => async (search?: SearchOptions<T>) => {
        const {count} = await pool.one(sql.type(countEntityGuard)`
            select count(*)
            from ${sql.identifier([entity.table])} ${buildSearchSql(entity, search)}
        `)

        return {count: Number(count)}
    }

export const getTotalRowCountWithPool =
    (pool: CommonQueryMethods) => async (table: IdentifierSqlToken) => {
        const {count} = await pool.one(sql.type(countEntityGuard)`
            select count(*)
            from ${table}
        `)

        return {count: Number(count)}
    }