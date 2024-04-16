import {Entity} from "@/types/index.js";
import {OidcModelInstance} from "@astoniq/loam-schemas";

export const oidcModelInstanceEntity: Entity<OidcModelInstance> =
    Object.freeze({
        table: 'oidc_model_instances',
        fields: {
            modelName: 'model_name',
            id: 'id',
            payload: 'payload',
            expiresAt: 'expires_at',
            consumedAt: 'consumed_at',
        },
        tableSingular: 'oidc_model_instance',
        fieldKeys: [
            'modelName',
            'id',
            'payload',
            'expiresAt',
            'consumedAt',
        ] as const,
    })