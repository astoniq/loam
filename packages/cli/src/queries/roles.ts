import {CommonQueryMethods, sql} from "slonik";
import {Role} from "@astoniq/loam-schemas";
import {Roles} from "@/entities";
import {convertToIdentifiers} from "@/utils/sql";
import {z} from 'zod'

export const createRolesQueries = (pool: CommonQueryMethods) => {

    const { table, fields } = convertToIdentifiers(Roles);

    const findRolesByRoleIds = async (roleIds: string[]) =>
        roleIds.length > 0
            ? pool.query(sql.unsafe`
        select ${sql.join(Object.values(fields), sql.fragment`, `)}
        from ${table}
        where ${fields.id} in (${sql.join(roleIds, sql.fragment`, `)})
      `)
            : [];
}