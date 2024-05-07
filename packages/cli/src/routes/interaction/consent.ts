import Router, {IRouterParamContext} from "koa-router";
import {WithInteractionDetailsContext} from "@/middlewares/koa-interaction-details.js";
import {ApplicationContext} from "@/application/types.js";
import {interactionPrefix} from "@/routes/interaction/const.js";
import koaGuard from "@/middlewares/koa-guard.js";
import {consent, getMissingScopes} from "@/libraries/session.js";
import {
    ConsentInfoResponse,
    consentInfoResponseGuard, MissingResourceScopes, missingResourceScopesGuard,
    publicApplicationInfoGuard,
    publicUserInfoGuard, Scope
} from "@astoniq/loam-schemas";
import {errors} from "oidc-provider";
import assertThat from "@/utils/assert-that.js";
import {Queries} from "@/application/queries.js";

const parseMissingResourceScopesInfo = async (
    queries: Queries,
    missingResourceScopes?: Record<string, string[]>
): Promise<MissingResourceScopes[]> => {
    if (!missingResourceScopes) {
        return []
    }

    const resourcesWithScopes = await Promise.all(
        Object.entries(missingResourceScopes).map(async ([resourceIndicator, scopeNames]) => {
            const resource = await queries.resource.findResourceByIndicator(resourceIndicator)

            assertThat(
                resource,
                new errors.InvalidTarget(`resource with indicator ${resourceIndicator} not found`)
            );

            const scopes = await Promise.all(
                scopeNames.map(async (scopeName) =>
                    queries.scope.findScopeByNameAndResourceId(scopeName, resource.id)
                )
            );

            return {
                resource,
                scopes: scopes.filter((scope): scope is Scope => !!scope),
            };
        })
    )

    return (
        resourcesWithScopes
            .filter(({scopes}) => scopes.length > 0)
            .map(resourceWithGroups => missingResourceScopesGuard.parse(resourceWithGroups))
    )
}

export default function consentRoutes<T extends IRouterParamContext>(
    router: Router<unknown, WithInteractionDetailsContext<T>>,
    {
        provider,
        queries
    }: ApplicationContext
) {
    const consentPath = `${interactionPrefix}/consent`;

    router.post(
        consentPath,
        koaGuard({
            status: [200]
        }),
        async (ctx, next) => {
            const {interactionDetails} = ctx
            const redirectTo = await consent(ctx, provider, interactionDetails)

            ctx.body = {redirectTo};

            return next();
        }
    )

    router.get(
        consentPath,
        koaGuard({
            status: [200],
            response: consentInfoResponseGuard
        }),
        async (ctx, next) => {
            const {interactionDetails} = ctx

            const {
                session,
                params: {client_id: clientId, redirect_uri: redirectUri},
                prompt,
            } = interactionDetails;

            assertThat(session, 'session.not_found');

            assertThat(
                clientId && typeof clientId === 'string',
                new errors.InvalidClient('client must be available')
            );

            assertThat(
                redirectUri && typeof redirectUri === 'string',
                new errors.InvalidRedirectUri('redirect_uri must be available')
            );

            const {accountId} = session;

            const userInfo = await queries.user.findUserById(accountId);

            const application = await queries.application.findApplicationById(clientId);

            const {missingOIDCScope, missingResourceScopes: allMissingResourceScopes = {}} =
                getMissingScopes(prompt);

            const missingResourceScopes = await parseMissingResourceScopesInfo(queries, allMissingResourceScopes)

            ctx.body = {
                application: publicApplicationInfoGuard.parse(application),
                user: publicUserInfoGuard.parse(userInfo),
                missingOIDCScope: missingOIDCScope?.filter(
                    scope => scope !== 'openid' && scope !== 'offline_access'
                ),
                missingResourceScopes,
                redirectUri
            } satisfies ConsentInfoResponse;

            return next()
        }
    )
}