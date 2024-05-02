import {AnonymousRouter, RouterContext, RouterInitArgs} from "@/routes/types.js";
import koaGuard from "@/middlewares/koa-guard.js";
import {z} from "zod";
import {interactionPrefix} from "./const.js";
import {eventGuard, identifierPayloadGuard, InteractionEvent, profileGuard} from "@astoniq/loam-schemas";
import Router from "koa-router";
import koaAuditLog from "@/middlewares/koa-audit-log.js";
import {koaInteractionSie, WithInteractionSieContext} from "@/middlewares/koa-interaction-sie.js";
import {koaInteractionDetails, WithInteractionDetailsContext} from "@/middlewares/koa-interaction-details.js";
import {
    verifyIdentifierSettings,
    verifyProfileSettings,
    verifySignInModeSettings
} from "./utils/sign-in-exprerience-validation.js";
import {verifyIdentifierPayload} from "./verifications/identifier-payload-verification.js";
import {storeInteractionResult} from "./utils/interaction.js";

export default function interactionRoutes<T extends AnonymousRouter>(...[router, application]: RouterInitArgs<T>) {

    const {provider, queries} = application

    const interactionRouter =
        // @ts-expect-error for good koa types
        (router as Router<unknown, WithInteractionDetailsContext<RouterContext<T>>>)
            .use(
                koaAuditLog(queries),
                koaInteractionDetails(provider)
            );

    const interactionSieRouter =
        // @ts-expect-error for good koa types
        (interactionRouter as Router<unknown, WithInteractionSieContext<WithInteractionDetailsContext<RouterContext<T>>>>)
            .use(
                koaInteractionSie(queries)
            );


    interactionSieRouter.put(
        interactionPrefix,
        koaGuard({
            body: z.object({
                event: eventGuard,
                identifier: identifierPayloadGuard.optional(),
                profile: profileGuard.optional(),
            }),
            status: [204, 400, 401, 403, 422],
        }),
        async (ctx, next) => {
            const {event, profile, identifier} = ctx.guard.body
            const {signInExperience} = ctx

            verifySignInModeSettings(event, signInExperience)

            if (identifier && event !== InteractionEvent.ForgotPassword) {
                verifyIdentifierSettings(identifier, signInExperience)
            }

            if (profile && event !== InteractionEvent.ForgotPassword) {
                verifyProfileSettings(profile, signInExperience)
            }

            const verifiedIdentifiers = identifier && [
                await verifyIdentifierPayload(ctx, identifier, {event}, application)
            ]

            await storeInteractionResult(
                {event, identifiers: verifiedIdentifiers, profile},
                ctx,
                provider
            )

            ctx.status = 204;

            return next();
        })


    interactionSieRouter.post(
        `${interactionPrefix}/submit`,
        koaGuard({
            status: [200, 204, 400, 401, 403, 404, 422],
            response: z
                .object({
                    redirectTo: z.string(),
                })
                .optional(),
        }),
        async (_ctx, _next) => {

        })
}