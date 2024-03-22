import {DatabaseTransactionConnection} from "slonik";

export type MigrationScript = {
    up: (connection: DatabaseTransactionConnection) => Promise<void>;
    down: (connection: DatabaseTransactionConnection) => Promise<void>
}