import {Entity} from "@/types/index.js";
import {Account} from "@astoniq/loam-schemas";

export const accountEntity: Entity<Account> =
    Object.freeze({
        table: 'accounts',
        tableSingular: 'account',
        fields: {
            id: 'id',
            username: 'username',
            primaryEmail: 'primary_email',
            primaryPhone: 'primary_phone',
            passwordEncrypted: 'password_encrypted',
            passwordEncryptionMethod: 'password_encryption_method',
            name: 'name',
            avatar: 'avatar',
            applicationId: 'application_id',
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
            'applicationId',
            'isSuspended',
            'lastSignInAt',
            'createdAt',
        ] as const,
    });