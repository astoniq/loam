import {WithAuthContext} from "@/middlewares/koa-auth.js";
import Router from "koa-router";

export type AuthedMeRouter = Router<unknown, WithAuthContext>;