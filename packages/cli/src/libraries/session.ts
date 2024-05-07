import {Context} from "koa";
import Provider, {InteractionResults, PromptDetail} from "oidc-provider";
import assertThat from "@/utils/assert-that.js";
import {conditional} from "@astoniq/essentials";
import {z} from "zod";


export const updateInteractionResult = async (
    ctx: Context,
    provider: Provider,
    result: InteractionResults,
    merge = false
) => {

    const details = merge ? await provider.interactionDetails(ctx.req, ctx.res) : undefined;

    return provider.interactionResult(ctx.req, ctx.res, {
        ...details?.result,
        ...result
    }, {mergeWithLastSubmission: merge})
}

export const assignInteractionResults = async (
    ctx: Context,
    provider: Provider,
    result: InteractionResults,
    merge = false
) => {
    const redirectTo = await updateInteractionResult(ctx, provider, result, merge)

    ctx.body = {redirectTo}
}

const missingScopesGuard = z.object({
    missingOIDCScope: z.string().array().optional(),
    missingResourceScopes: z.object({}).catchall(z.string().array()).optional()
})

export const getMissingScopes = (prompt: PromptDetail) => {
    return missingScopesGuard.parse(prompt.details)
}

export const consent = async (
    ctx: Context,
    provider: Provider,
    interactionDetails: Awaited<ReturnType<Provider['interactionDetails']>>
) => {
    const {
        session,
        grantId,
        params: {client_id},
        prompt
    } = interactionDetails

    assertThat(session, 'session.not_found');

    const {accountId} = session;

    const grant =
        conditional(grantId && (await provider.Grant.find(grantId))) ??
        new provider.Grant({accountId, clientId: String(client_id)});

    const {missingOIDCScope, missingResourceScopes} = getMissingScopes(prompt);

    if (missingOIDCScope) {
        grant.addOIDCScope(missingOIDCScope.join(' '))
    }

    if (missingResourceScopes) {
        for (const [indicator, scope] of Object.entries(missingResourceScopes)) {
            grant.addResourceScope(indicator, scope.join(' '));
        }
    }

    return updateInteractionResult(ctx, provider, {consent: {grantId: await grant.save()}}, true)
}