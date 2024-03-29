import type {ExtendableContext} from 'koa';
import type Router from 'koa-router';
import {WithAuthContext} from "@/middlewares/koa-auth.js";

type AuthedRouterContext = WithAuthContext & ExtendableContext;

export type AuthedRouter = Router<unknown, AuthedRouterContext>;

type RouterInit<T> = (router: T) => void;

export type RouterInitArgs<T> = Parameters<RouterInit<T>>;