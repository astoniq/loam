import {AuthedRouter, RouterInitArgs} from "@/routes/types.js";
import koaGuard from "@/middlewares/koa-guard.js";
import {object, string} from "zod";


export default function resourceRoutes<T extends AuthedRouter>(...[router]: RouterInitArgs<T>) {


    router.get('/resources/:id',
        koaGuard({
            params: object({id: string().min(1)}),
            status: [200, 404]
        }),
        async (_ctx, next) => {

        return next()
    })

}