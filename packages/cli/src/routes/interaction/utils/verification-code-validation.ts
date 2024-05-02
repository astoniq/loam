import {InteractionEvent, VerifyVerificationCodePayload} from "@astoniq/loam-schemas";
import {TemplateType} from "@astoniq/loam-connector-kit";
import {PasscodeLibrary} from "@/libraries/passcode.js";
import {LogContext} from "@/middlewares/koa-audit-log.js";


const eventToTemplateTypeMap: Record<InteractionEvent, TemplateType> = {
    SignIn: TemplateType.SignIn,
    Register: TemplateType.Register,
    ForgotPassword: TemplateType.ForgotPassword
}

const getTemplateTypeByEvent = (event: InteractionEvent): TemplateType =>
    eventToTemplateTypeMap[event];

export const verifyIdentifierByVerificationCode = async (
    payload: VerifyVerificationCodePayload & { event: InteractionEvent },
    jti: string,
    createLog: LogContext['createLog'],
    passcodeLibrary: PasscodeLibrary
) => {
    const {event, verificationCode, ...identifier} = payload;
    const messageType = getTemplateTypeByEvent(event);

    createLog(`Interaction.${event}.Identifier.VerificationCode.Submit`);

    await passcodeLibrary.verifyPasscode(jti, messageType, verificationCode, identifier);
};