import {OidcConfig} from "@/config/index.js";
import {Queries} from "@/application/queries.js";
import {AdapterFactory, AllClientMetadata, errors} from "oidc-provider";
import {consoleApplicationId, CreateApplication} from "@astoniq/loam-schemas";
import {appendPath, conditional, tryThat} from "@astoniq/essentials";
import {getConstantClientMetadata} from "@/oidc/utils.js";
import snakecaseKeys from "snakecase-keys";
import {addSeconds} from "date-fns";

const transpileMetadata = (clientId: string, data: AllClientMetadata, config: OidcConfig): AllClientMetadata => {
    if (clientId != consoleApplicationId) {
        return data
    }

    const url = appendPath(config.endpoint, '/console')

    return {
        ...data,
        redirect_uris: [
            ...(data.redirect_uris ?? []),
            appendPath(url, '/callback').href
        ],
        post_logout_redirect_uris: [...(data.post_logout_redirect_uris ?? []), url.toString()]
    }
}

export default function postgresAdapter(
    config: OidcConfig,
    queries: Queries,
    modelName: string
): ReturnType<AdapterFactory> {

    const {
        application: {
            findApplicationById
        },
        oidcModelInstance: {
            upsertInstance,
            destroyInstanceById,
            findPayloadByPayloadField,
            revokeInstanceByGrantId,
            consumeInstanceById,
            findPayloadById
        }
    } = queries;

    if (modelName === 'Client') {
        const reject = async () => {
            throw new Error('Not implemented')
        }

        const transpileClient = (
            {
                id: client_id,
                secret: client_secret,
                name: client_name,
                type,
                oidcClientMetadata,
                customClientMetadata
            }: CreateApplication,
            clientScopes?: string[]
        ): AllClientMetadata => ({
            client_id,
            client_secret,
            client_name,
            ...getConstantClientMetadata(type, config),
            ...transpileMetadata(client_id, snakecaseKeys(oidcClientMetadata), config),
            ...customClientMetadata,
            ...conditional(clientScopes && {scope: clientScopes.join(' ')})
        })

        return {
            upsert: reject,
            find: async (id: string) => {

                const application = await tryThat(
                    findApplicationById(id),
                    new errors.InvalidClient(`invalid client ${id}`)
                )

                return transpileClient(application)
            },
            findByUserCode: reject,
            findByUid: reject,
            consume: reject,
            destroy: reject,
            revokeByGrantId: reject
        }
    }

    return {
        upsert: async (id, payload, expiresIn) => {
            return upsertInstance({
                id,
                modelName,
                payload,
                expiresAt: addSeconds(Date.now(), expiresIn).valueOf()
            })
        },
        find: async (id) => findPayloadById(modelName, id),
        findByUserCode: async (userCode) => findPayloadByPayloadField(modelName, 'userCode', userCode),
        findByUid: async (uid) => findPayloadByPayloadField(modelName, 'uid', uid),
        consume: async (id) => consumeInstanceById(modelName, id),
        destroy: async (id) => destroyInstanceById(modelName, id),
        revokeByGrantId: async (grantId) => revokeInstanceByGrantId(modelName, grantId),
    }

}