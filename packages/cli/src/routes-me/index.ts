import Koa from "koa";
import {AuthedMeRouter} from "@/routes-me/types.js";
import Router from "koa-router";


export function initMeApis(): Koa {

    const meRouter: AuthedMeRouter = new Router()

    const meApp = new Koa()

    meApp.use(meRouter.routes()).use(meRouter.allowedMethods())

    return meApp;
}