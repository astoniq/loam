import {CommonQueryMethods, sql} from "slonik";
import {Roles} from "@/entities";
import {convertToIdentifiers} from "@/utils/sql";
import {roleGuard} from "@/guards/roles";

export const createRolesQueries = (pool: CommonQueryMethods) => {

    const { table, fields } = convertToIdentifiers(Roles);

    const findRolesByRoleIds = async (roleIds: string[]) =>
        roleIds.length > 0
            ? pool.any(sql.type(roleGuard)`
        select ${sql.join(Object.values(fields), sql.fragment`, `)}
        from ${table}
        where ${fields.id} in (${sql.join(roleIds, sql.fragment`, `)})
      `)
            : [];
}