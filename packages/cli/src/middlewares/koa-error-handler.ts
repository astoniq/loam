import {HttpError, Middleware} from "koa";
import {RequestErrorBody} from "@astoniq/loam-schemas";
import {RequestError} from "@/errors/request-error.js";
import {Config} from "@/config/index.js";
import {logger} from "@/utils/logger.js";


export default function koaErrorHandler<StateT, ContextT, BodyT>(config: Config): Middleware<
    StateT, ContextT, BodyT | RequestErrorBody | { message: string }> {
    return async (ctx, next) => {
        try {
            await next()
        } catch (error: unknown) {

            if (!config.isUnitTest && !config.isProduction) {
                logger.error(error)
            }

            if (error instanceof RequestError) {
                ctx.status = error.status
                ctx.body = error.body

                return;
            }

            if (error instanceof HttpError) {
                return;
            }

            if (config.isProduction) {
                logger.error(error)
            }

            ctx.status = 500;
            ctx.body = {message: "Internal server error."}
        }
    }
}