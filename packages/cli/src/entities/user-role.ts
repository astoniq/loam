import {Entity} from "@/types/index.js";
import {UserRole} from "@astoniq/loam-schemas";

export const userRoleEntity: Entity<UserRole> =
    Object.freeze({
        table: 'user_roles',
        tableSingular: 'user_role',
        fields: {
            id: 'id',
            userId: 'user_id',
            roleId: 'role_id',
        },
        fieldKeys: [
            'id',
            'userId',
            'roleId',
        ] as const,
    });