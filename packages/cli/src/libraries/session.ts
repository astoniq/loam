import {Context} from "koa";
import Provider, {InteractionResults} from "oidc-provider";


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