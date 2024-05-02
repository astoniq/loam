import {Entity} from "@/types/index.js";
import {Passcode} from "@astoniq/loam-schemas";

export const passcodeEntity: Entity<Passcode> =
    Object.freeze({
        table: 'passcodes',
        fields: {
            id: 'id',
            interactionJti: 'interaction_jti',
            email: 'email',
            type: 'type',
            code: 'code',
            consumed: 'consumed',
            tryCount: 'try_count',
            createdAt: 'created_at',
        },
        tableSingular: 'passcode',
        fieldKeys: [
            'id',
            'interactionJti',
            'email',
            'type',
            'code',
            'consumed',
            'tryCount',
            'createdAt',
        ] as const,
    })