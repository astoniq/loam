import {
    AccountIdIdentifier,
    AnonymousInteractionResult,
    Identifier,
    PasswordIdentifierPayload
} from "@/routes/interaction/types.js";
import {WithInteractionSieContext} from "@/middlewares/koa-interaction-sie.js";
import {WithLogContext} from "@/middlewares/koa-audit-log.js";
import {IdentifierPayload, InteractionEvent} from "@astoniq/loam-schemas";
import {isPasswordIdentifier} from "@/routes/interaction/utils/indentifier-is-identifier.js";
import {isKeyInObject, Optional} from "@astoniq/essentials";
import assertThat from "@/utils/assert-that.js";
import {ApplicationContext} from "@/application/types.js";
import {RequestError} from "@/errors/index.js";
import {findUserByIdentifier} from "@/routes/interaction/utils/find-user-by-identifier.js";


const verifyPasswordIdentifier = async (
    event: InteractionEvent,
    identifier: PasswordIdentifierPayload,
    ctx: WithLogContext,
    application: ApplicationContext
): Promise<AccountIdIdentifier> => {
    const {password, ...identity} = identifier;

    assertThat(
        event !== InteractionEvent.ForgotPassword,
        'session.not_supported_for_forgot_password'
    )

    ctx.createLog(`Interaction.${event}.Identifier.Password.Submit`)

    const user = await findUserByIdentifier(application, identity)

    const verifiedUser = await application.libraries.user.verifyUserPassword(user, password);

    const {isSuspended, id} = verifiedUser

    assertThat(!isSuspended, new RequestError({code: 'user.suspended', status: 401}))

    return {key: 'accountId', value: id}

}

function identifierPayloadVerification(
    ctx: WithInteractionSieContext<WithLogContext>,
    identifierPayload: IdentifierPayload,
    interactionStorage: AnonymousInteractionResult,
    application: ApplicationContext
): Promise<Identifier> {

    const {event} = interactionStorage

    if (isPasswordIdentifier(identifierPayload)) {
        return verifyPasswordIdentifier(event, identifierPayload, ctx, application)
    }

}

const getUserIdentifier = (payload: IdentifierPayload): Optional<string> => {
    for (const key of ['email'] as const) {
        if (isKeyInObject(payload, key)) {
            return String(payload[key])
        }
    }
    return;
}


export const verifyIdentifierPayload: typeof identifierPayloadVerification = async (
    ctx,
    identifierPayload,
    interactionStorage,
    application
) => {

    return identifierPayloadVerification(
        ctx,
        identifierPayload,
        interactionStorage,
        application
    );
}