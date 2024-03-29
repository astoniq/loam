import {Entity} from "@/types/index.js";
import {System} from "@astoniq/loam-schemas";

export const systemEntity: Entity<System> =
    Object.freeze({
        table: 'systems',
        fields: {
            name: 'name',
            value: 'value'
        },
        tableSingular: 'system',
        fieldKeys: [
            'name',
            'value'
        ] as const,
    })