import {MigrationScript} from "@/types";
import {sql} from "slonik";


const migration: MigrationScript = {
    up: async (pool) => {
        await pool.query(sql.unsafe`
            create table role ();
        `)
    },
    down: async (pool) => {

    }
}

export default migration