import {Entity} from "@/types/index.js";
import {User} from "@astoniq/loam-schemas";

export const userEntity: Entity<User> =
    Object.freeze({
        table: 'users',
        tableSingular: 'user',
        fields: {
            id: 'id',
            email: 'email',
            passwordEncrypted: 'password_encrypted',
            passwordEncryptionMethod: 'password_encryption_method',
            isSuspended: 'is_suspended',
            lastSignInAt: 'last_sign_in_at',
            createdAt: 'created_at',
        },
        fieldKeys: [
            'id',
            'email',
            'passwordEncrypted',
            'passwordEncryptionMethod',
            'isSuspended',
            'lastSignInAt',
            'createdAt',
        ] as const,
    });