import {
    AccountIdIdentifier,
    AnonymousInteractionResult,
    Identifier,
    PasswordIdentifierPayload, SocialVerifiedIdentifierPayload
} from "@/routes/interaction/types.js";
import {WithInteractionSieContext} from "@/middlewares/koa-interaction-sie.js";
import {WithLogContext} from "@/middlewares/koa-audit-log.js";
import {
    IdentifierPayload,
    InteractionEvent,
    SocialConnectorPayload,
    VerifyVerificationCodePayload
} from "@astoniq/loam-schemas";
import {
    isPasswordIdentifier,
    isSocialIdentifier,
    isVerificationCodeIdentifier
} from "../utils/indentifier-is-identifier.js";
import assertThat from "@/utils/assert-that.js";
import {ApplicationContext} from "@/application/types.js";
import {RequestError} from "@/errors/index.js";
import {findUserByIdentifier} from "../utils/find-user-by-identifier.js";
import {SocialIdentifier, VerifiedEmailIdentifier} from "@/routes/interaction/guard.js";
import {verifyIdentifierByVerificationCode} from "../utils/verification-code-validation.js";


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

const verifyVerificationCodeIdentifier = async (
    event: InteractionEvent,
    identifier: VerifyVerificationCodePayload,
    ctx: WithLogContext,
    {provider, libraries}: ApplicationContext
): Promise<VerifiedEmailIdentifier> => {
    const {jti} = await provider.interactionDetails(ctx.req, ctx.res);

    await verifyIdentifierByVerificationCode(
        {...identifier, event},
        jti,
        ctx.createLog,
        libraries.passcode
    );

    return {key: "emailVerified", value: identifier.email}
}

const verifySocialVerifiedIdentifier = async (
    payload: SocialVerifiedIdentifierPayload,
    ctx: WithLogContext,
    interactionRecord?: AnonymousInteractionResult
): Promise<VerifiedEmailIdentifier> => {
    ctx.createLog(`Interaction.SignIn.Identifier.Social.Submit`);


    const {connectorId} = payload;

    // Sign-in with social verified email or phone requires a social identifier in the interaction result
    const socialIdentifierRecord = interactionRecord?.identifiers?.find(
        (entity): entity is SocialIdentifier =>
            entity.key === 'social' && entity.connectorId === connectorId
    );

    assertThat(socialIdentifierRecord, new RequestError('session.connector_session_not_found'));

    const {email} = payload;
    assertThat(
        socialIdentifierRecord.userInfo.email === email,
        new RequestError('session.connector_session_not_found')
    );

    return {
        key: 'emailVerified',
        value: email,
    };
}

const verifySocialIdentifier = async (
    identifier: SocialConnectorPayload
): Promise<SocialIdentifier> => {

    return {key: 'social', connectorId: identifier.connectorId, userInfo: {id: ""}};
};

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

    if (isVerificationCodeIdentifier(identifierPayload)) {
        return verifyVerificationCodeIdentifier(event, identifierPayload, ctx, application)
    }

    if (isSocialIdentifier(identifierPayload)) {
        return verifySocialIdentifier(identifierPayload)
    }

    return verifySocialVerifiedIdentifier(identifierPayload, ctx, interactionStorage)
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