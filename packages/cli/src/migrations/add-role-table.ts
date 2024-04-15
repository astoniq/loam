import {Migration} from "@/types/index.js";
import {sql} from "slonik";


export const addRoleTableMigration: Migration = {
    up: async (pool) => {
        await pool.query(sql.unsafe``)
    },
    down: async () => {

    }
}