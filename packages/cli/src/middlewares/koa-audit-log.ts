import {IRouterParamContext} from "koa-router";
import {Context} from "koa";

export type LogContext = {

}

export type WithLogContext<ContextT extends IRouterParamContext = IRouterParamContext & Context> =
    ContextT & LogContext