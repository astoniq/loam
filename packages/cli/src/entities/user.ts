import {Entity} from "@/types/index.js";
import {User} from "@astoniq/loam-schemas";

export const userEntity: Entity<User> =
    Object.freeze({
        table: 'users',
        tableSingular: 'user',
        fields: {
            id: 'id',
            username: 'username',
            primaryEmail: 'primary_email',
            primaryPhone: 'primary_phone',
            passwordEncrypted: 'password_encrypted',
            passwordEncryptionMethod: 'password_encryption_method',
            name: 'name',
            avatar: 'avatar',
            isSuspended: 'is_suspended',
            lastSignInAt: 'last_sign_in_at',
            createdAt: 'created_at',
        },
        fieldKeys: [
            'id',
            'username',
            'primaryEmail',
            'primaryPhone',
            'passwordEncrypted',
            'passwordEncryptionMethod',
            'name',
            'avatar',
            'isSuspended',
            'lastSignInAt',
            'createdAt',
        ] as const,
    });