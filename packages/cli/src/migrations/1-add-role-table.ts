import {MigrationScript} from "@/types/index.js";
import {sql} from "slonik";


const migration: MigrationScript = {
    up: async (pool) => {
        await pool.query(sql.unsafe``)
    },
    down: async () => {

    }
}

export default migration