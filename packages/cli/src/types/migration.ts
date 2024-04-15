import {DatabaseTransactionConnection} from "slonik";

export type Migration = {
    up: (connection: DatabaseTransactionConnection) => Promise<void>;
    down: (connection: DatabaseTransactionConnection) => Promise<void>
}