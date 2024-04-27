import Provider from "oidc-provider";
import {Middleware} from "koa";
import {IRouterParamContext} from "koa-router";

export type WithInteractionDetailsContext<ContextT extends IRouterParamContext = IRouterParamContext> = ContextT & {
    interactionDetails: Awaited<ReturnType<Provider['interactionDetails']>>
}


export function koaInteractionDetails<StateT,
    ContextT extends IRouterParamContext,
    ResponseT>(provider: Provider): Middleware<StateT, WithInteractionDetailsContext<ContextT>, ResponseT> {
    return async (ctx, next) => {
        ctx.interactionDetails = await provider.interactionDetails(ctx.req, ctx.res)

        return next()
    }
}