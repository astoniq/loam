import {DatabasePool} from "slonik";
import {Migration} from "@/types/index.js";
import {logger} from "@/utils/logger.js";
import {updateMigrationTimestamp} from "@/queries/migration.js";

export const getAvailableMigrations = async () => {
    return []
}

export const checkMigrationState = async () => {
    const migrations = await getAvailableMigrations()

    if (migrations.length === 0) {
        return;
    }

    throw new Error('Undeployed database migration found.')
}

export const deployMigration = async (
    pool: DatabasePool,
    migration: Migration,
    timestamp: number,
    action: 'up' | 'down' = 'up'
) => {
    const {up, down} = migration;

    try {
        await pool.transaction(async (connection) => {
            if (action === 'up') {
                await up(connection);
                await updateMigrationTimestamp(connection, timestamp)
            }

            if (action === 'down') {
                await down(connection);
                await updateMigrationTimestamp(connection, timestamp - 1)
            }
        });
    } catch (error) {
        logger.error(error, `Error during running migration timestamp (${timestamp})`);
        await pool.end();
    }

    logger.info(`Running migration (${timestamp}) succeeded`)
}