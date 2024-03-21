import type {IMiddleware, IRouterParamContext} from 'koa-router';

export type Auth = {
    type: 'user' | 'app';
    id: string
}

export type WithAuthContext<Context extends IRouterParamContext = IRouterParamContext> = Context & {
    auth: Auth
}