import {HttpError, Middleware} from "koa";
import {RequestErrorBody} from "@astoniq/loam-schemas";
import RequestError from "@/errors/request-error";


export default function koaErrorHandler<StateT, ContextT, BodyT>(): Middleware<
    StateT, ContextT, BodyT | RequestErrorBody | { message: string }> {
    return async (ctx, next) => {
        try {
            await next()
        } catch (error: unknown) {
            if (error instanceof RequestError) {
                ctx.status = error.status
                ctx.body = error.body

                return;
            }

            if (error instanceof HttpError) {
                return;
            }

            ctx.status = 500;
            ctx.body = {message: "Internal server error."}
        }
    }
}