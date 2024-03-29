import {Entity} from "@/types/index.js";
import {Role} from "@astoniq/loam-schemas";

export const roleEntity: Entity<Role> =
    Object.freeze({
        table: 'roles',
        tableSingular: 'role',
        fields: {
            id: 'id',
            name: 'name',
            description: 'description',
            type: 'type',
        },
        fieldKeys: [
            'id',
            'name',
            'description',
            'type',
        ] as const,
    });