import type {ExtendableContext} from 'koa';
import type Router from 'koa-router';
import {WithAuthContext} from "@/middlewares/koa-auth.js";
import {WithLogContext} from "@/middlewares/koa-audit-log.js";
import {WithI18nContext} from "@/middlewares/koa-i18next.js";
import {ApplicationContext} from "@/application/types.js";

type AuthedRouterContext = WithAuthContext & ExtendableContext;

export type AuthedRouter = Router<unknown, AuthedRouterContext>;

export type AnonymousRouter = Router<unknown, WithLogContext & WithI18nContext>;

type ManagementApiRouterContext = WithAuthContext &
    WithLogContext &
    WithI18nContext &
    ExtendableContext;

export type ManagementApiRouter = Router<unknown, ManagementApiRouterContext>;

export type RouterContext<T> = T extends Router<unknown, infer Context> ? Context : never;

type RouterInit<T> = (router: T, application: ApplicationContext) => void;

export type RouterInitArgs<T> = Parameters<RouterInit<T>>;