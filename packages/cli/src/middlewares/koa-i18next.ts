import {IRouterParamContext} from "koa-router";


export type WithI18nContext<ContextT extends IRouterParamContext = IRouterParamContext> =
    ContextT & {
    locale: string
}