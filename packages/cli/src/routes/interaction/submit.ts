import {
    VerifiedInteractionResult,
    VerifiedRegisterInteractionResult,
    VerifiedSignInInteractionResult
} from "@/routes/interaction/types.js";
import {WithLogContext} from "@/middlewares/koa-audit-log.js";
import {WithInteractionDetailsContext} from "@/middlewares/koa-interaction-details.js";
import {ApplicationContext} from "@/application/types.js";
import {InteractionEvent} from "@astoniq/loam-schemas";

async function handleSubmitRegister(
    interaction: VerifiedRegisterInteractionResult,
    ctx: WithLogContext & WithInteractionDetailsContext,
    application: ApplicationContext
) {

}

async function handleSubmitSignIn(
    interaction: VerifiedSignInInteractionResult,
    ctx: WithLogContext & WithInteractionDetailsContext,
    application: ApplicationContext
) {

}

export function submitInteraction(
    interaction: VerifiedInteractionResult,
    ctx: WithLogContext & WithInteractionDetailsContext,
    application: ApplicationContext) {

    const {event} = interaction

    if (event === InteractionEvent.Register) {
        return handleSubmitRegister(interaction, ctx, application)
    }

    if (event === InteractionEvent.SignIn) {
        return handleSubmitSignIn(interaction, ctx, application)
    }

    ctx.status = 204;
}