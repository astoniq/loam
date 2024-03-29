import {Entity} from "@/types/index.js";
import {Resource} from "@astoniq/loam-schemas";

export const resourceEntity: Entity<Resource> =
    Object.freeze({
        table: 'resources',
        fields: {
            id: 'id',
            name: 'name'
        },
        tableSingular: 'resource',
        fieldKeys: [
            'id',
            'name'
        ] as const,
    })