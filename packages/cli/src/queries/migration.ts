import {CommonQueryMethods, DatabaseTransactionConnection, NotFoundError, sql} from "slonik";
import {convertToIdentifiers} from "@/utils/sql.js";
import {systemEntity} from "@/entities/index.js";
import {MigrationState, MigrationStateKey, systemGuard, systemGuards} from "@/guards/index.js";


const {table, fields} = convertToIdentifiers(systemEntity);

export const getCurrentDatabaseMigrationTimestamp = async (pool: CommonQueryMethods) => {
    try {
        const result = await pool.one(sql.type(systemGuard)`
            select *
            from ${table}
            where ${fields.name} = ${MigrationStateKey.MigrationState}
        `)

        const parsed = systemGuards[MigrationStateKey.MigrationState]
            .safeParse(result?.value)

        return (parsed.success && parsed.data.timestamp) || 0;

    } catch (error: unknown) {
        if (error instanceof NotFoundError) {
            return 0;
        }
        throw error;
    }
}

export const updateMigrationTimestamp = async (
    connection: DatabaseTransactionConnection,
    timestamp: number
) => {
    const value: MigrationState = {
        timestamp
    }

    await connection.query(
        sql.unsafe`
        insert into ${table} (${fields.name}, ${fields.value})
        values (${MigrationStateKey.MigrationState}, ${sql.jsonb(value)})`
    )
}