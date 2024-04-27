import {AnonymousInteractionResult} from "@/routes/interaction/types.js";
import {InteractionEvent} from "@astoniq/loam-schemas";
import {Context} from "koa";
import Provider from "oidc-provider";

export const storeInteractionResult = async (
    interaction: Omit<AnonymousInteractionResult, 'event'> & { event?: InteractionEvent },
    ctx: Context,
    provider: Provider,
    merge = false
) => {

    const details = merge ? await provider.interactionDetails(ctx.req, ctx.res) : undefined

    await provider.interactionResult(
        ctx.req,
        ctx.res,
        {...details?.result, ...interaction},
        {mergeWithLastSubmission: merge}
    )
}