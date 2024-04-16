import {Entity} from "@/types/index.js";
import {Log} from "@astoniq/loam-schemas";

export const logEntity: Entity<Log> =
    Object.freeze({
        table: 'logs',
        tableSingular: 'log',
        fields: {
            id: 'id',
            key: 'key',
            payload: 'payload',
            createdAt: 'created_at',
        },
        fieldKeys: [
            'id',
            'key',
            'payload',
            'createdAt',
        ] as const,
    });