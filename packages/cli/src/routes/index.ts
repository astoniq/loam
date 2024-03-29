import Koa from 'koa';
import Router from "koa-router";
import {AnonymousRouter} from "@/routes/types.js";

const createRouters = () => {

    const anonymousRouter: AnonymousRouter = new Router();

    return [anonymousRouter]
}

export function initApis(): Koa {
    const apisApp = new Koa()

    for (const router of createRouters()) {
        apisApp.use(router.routes()).use(router.allowedMethods())
    }

    return apisApp;
}