import {IdentifierPayload, SocialConnectorPayload} from "@astoniq/loam-schemas";
import {PasswordIdentifierPayload} from "@/routes/interaction/types.js";
import {VerifyVerificationCodePayload} from "@astoniq/loam-schemas";

export const isPasswordIdentifier = (
   identifier: IdentifierPayload
): identifier is PasswordIdentifierPayload => 'password' in identifier

export const isVerificationCodeIdentifier = (
    identifier: IdentifierPayload
): identifier is VerifyVerificationCodePayload  => 'verificationCode' in identifier

export const isSocialIdentifier = (
    identifier: IdentifierPayload
): identifier is SocialConnectorPayload =>
    'connectorId' in identifier && 'connectorData' in identifier;

