import {ManagementApiRouter, RouterInitArgs} from "@/routes/types.js";
import koaGuard from "@/middlewares/koa-guard.js";
import {requestVerificationCodePayloadGuard, verifyVerificationCodePayloadGuard} from "@astoniq/loam-schemas";
import {TemplateType} from "@astoniq/loam-connector-kit";

export default function verificationCodeRoutes<T extends ManagementApiRouter>(
    ...[router, {libraries}]: RouterInitArgs<T>
) {

    const {passcode: {verifyPasscode}} = libraries

    router.post(
        '/verification-codes',
        koaGuard({
            body: requestVerificationCodePayloadGuard,
            status: [204, 400, 501],
        }),
        async (ctx, next) => {
            ctx.status = 204;

            return next();
        }
    );

    router.post(
        '/verification-codes/verify',
        koaGuard({
            body: verifyVerificationCodePayloadGuard,
            status: [204, 400],
        }),
        async (ctx, next) => {

            const {verificationCode, ...identifier} = ctx.guard.body

            await verifyPasscode(undefined, TemplateType.Generic, verificationCode, identifier)

            ctx.status = 204;

            return next();
        }
    );
}