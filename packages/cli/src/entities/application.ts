import {Entity} from "@/types/index.js";
import {Application} from "@astoniq/loam-schemas";

export const applicationEntity: Entity<Application> =
    Object.freeze({
        table: 'applications',
        fields: {
            id: 'id',
            name: 'name',
            secret: 'secret',
            description: 'description',
            type: 'type',
            oidcClientMetadata: 'oidc_client_metadata',
            customClientMetadata: 'custom_client_metadata',
            isThirdParty: 'is_third_party',
            createdAt: 'created_at',
        },
        tableSingular: 'application',
        fieldKeys: [
            'id',
            'name',
            'secret',
            'description',
            'type',
            'oidcClientMetadata',
            'customClientMetadata',
            'isThirdParty',
            'createdAt',
        ] as const,
    })