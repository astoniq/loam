import {Entity} from "@/types/index.js";
import {System} from "@astoniq/loam-schemas";

export const systemEntity: Entity<System> =
    Object.freeze({
        table: 'systems',
        fields: {
            key: 'key',
            value: 'value'
        },
        tableSingular: 'system',
        fieldKeys: [
            'key',
            'value'
        ] as const,
    })