import {Entity} from "@/types";

export type RoleKeys = 'tenantId' | 'id' | 'name' | 'description' | 'type';

export const Roles: Entity<
    RoleKeys,
    'roles',
    'role'
> = Object.freeze({
    table: 'roles',
    tableSingular: 'role',
    fields: {
        tenantId: 'tenant_id',
        id: 'id',
        name: 'name',
        description: 'description',
        type: 'type',
    },
    fieldKeys: [
        'tenantId',
        'id',
        'name',
        'description',
        'type',
    ] as const,
});