import {Middleware} from "koa";
import {SlonikError} from "slonik";

export default function koaSlonikErrorHandler<StateT, ContextT>(): Middleware<StateT, ContextT> {
    return async (_ctx, next) => {
        try {
            await next()
        } catch (error: unknown) {
            if (!(error instanceof SlonikError)) {
                throw error
            }

            throw error
        }
    }
}