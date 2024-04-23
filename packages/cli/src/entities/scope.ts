import {Entity} from "@/types/index.js";
import {Scope} from "@astoniq/loam-schemas";

export const scopeEntity: Entity<Scope> =
    Object.freeze({
        table: 'scopes',
        tableSingular: 'scope',
        fields: {
            id: 'id',
            resourceId: 'resource_id',
            name: 'name',
            description: 'description',
            createdAt: 'created_at',
        },
        fieldKeys: [
            'id',
            'resourceId',
            'name',
            'description',
            'createdAt',
        ] as const,
    });