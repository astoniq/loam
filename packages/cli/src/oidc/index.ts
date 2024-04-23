import {OidcConfig} from "@/config/index.js";
import {Queries} from "@/application/queries.js";
import Provider, {errors} from "oidc-provider";
import postgresAdapter from "@/oidc/adapter.js";
import koaAuditLog from "@/middlewares/koa-audit-log.js";
import {assert, tryThat} from "@astoniq/essentials";
import {getAcceptedUserClaims, getUserClaimsData} from "@/oidc/scope.js";
import snakecaseKeys from "snakecase-keys";
import {Libraries} from "@/application/libraries.js";
import {userClaims} from "@astoniq/loam-core-kit";
import {getSharedResourceServerData} from "@/oidc/resource.js";


export default function initOidc(config: OidcConfig,
                                 queries: Queries,
                                 libraries: Libraries) {


    const {
        user: {findUserById},
        scope: {findScopesByResourceId},
        resource: {findResourceByIndicator}
    } = queries;

    const {issuer} = config

    const oidc = new Provider(issuer.href, {
        adapter: postgresAdapter.bind(null, config, queries),
        renderError: (ctx, body, _error) => {
            ctx.body = body
        },
        jwks: {
            keys: []
        },
        claims: userClaims,
        conformIdTokenClaims: false,
        features: {
            resourceIndicators: {
                enabled: true,
                useGrantedResource: () => false,
                getResourceServerInfo: async (_ctx, indicator) => {
                    const resource = await findResourceByIndicator(indicator)

                    if (!resource) {
                        throw new errors.InvalidTarget()
                    }

                    const scopes = await findScopesByResourceId(resource.id)

                    return {
                        ...getSharedResourceServerData(config),
                        scope: scopes.map(({name}) => name).join(' ')
                    }
                }
            }
        },
        findAccount: async (_ctx, sub) => {
            const user = await tryThat(findUserById(sub), () => {
                throw new errors.InvalidGrant('user not found')
            })

            return {
                accountId: sub,
                claims: async (use, scope, _claims, rejected) => {
                    assert(
                        use === 'id_token' || use === 'userinfo',
                        new errors.InvalidRequest('use should be either `id_token` or `userinfo`')
                    );

                    const acceptedClaims = getAcceptedUserClaims(use, scope, rejected)

                    return snakecaseKeys(
                        {
                            sub,
                            ...Object.fromEntries(
                                await getUserClaimsData(user, acceptedClaims, libraries.user)
                            )
                        },
                        {
                            deep: false
                        }
                    )
                }
            }
        },
        pkce: {
            required: (_ctx, client) => {
                return client.clientAuthMethod !== 'client_secret_basic'
            },
            methods: ['S256']
        }
    })

    oidc.use(koaAuditLog(queries))

    return oidc
}