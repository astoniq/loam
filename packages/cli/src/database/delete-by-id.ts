import {CommonQueryMethods, sql} from "slonik";
import {DeletionError} from "@/errors";

export const buildDeleteByIdWithPool =
    (pool: CommonQueryMethods, table: string) => async (id: string) => {
        const {rowCount} = await pool.query(sql.unsafe`
            delete
            from ${sql.identifier([table])}
            where ${sql.identifier(['id'])} = ${id}`)

        if (rowCount < 1) {
            throw new DeletionError(table, id)
        }
    }