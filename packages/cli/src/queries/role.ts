import {CommonQueryMethods, sql} from "slonik";
import {roleEntity} from "@/entities";
import {convertToIdentifiers} from "@/utils/sql";
import {roleGuard} from "@/guards";

export const createRoleQueries = (pool: CommonQueryMethods) => {

    const {table, fields} = convertToIdentifiers(roleEntity);

    const findRoleByIds = async (roleIds: string[]) =>
        roleIds.length > 0
            ? pool.any(sql.type(roleGuard)`
                    select ${sql.join(Object.values(fields), sql.fragment`, `)}
                    from ${table}
                    where ${fields.id} in (${sql.join(roleIds, sql.fragment`, `)})
            `)
            : [];

    return {
        findRoleByIds
    }
}