import {z} from "zod";
import {
    accountIdIdentifierGuard,
    anonymousInteractionResultGuard,
    identifierGuard
} from "@/routes/interaction/guard.js";
import {EmailPasswordPayload, InteractionEvent} from "@astoniq/loam-schemas";

export type AccountIdIdentifier = z.infer<typeof accountIdIdentifierGuard>;

export type Identifier = z.infer<typeof identifierGuard>

export type VerifiedSignInInteractionResult = {
    event: InteractionEvent.SignIn;
    accountId: string;
    identifiers: Identifier[];
}

export type VerifiedForgotPasswordInteractionResult = {
    event: InteractionEvent.ForgotPassword;
    accountId: string;
    identifiers: Identifier[];
    profile: {
        password: string;
    };
};

export type VerifiedInteractionResult =
    | VerifiedSignInInteractionResult
    | VerifiedForgotPasswordInteractionResult


export type AnonymousInteractionResult = z.infer<typeof anonymousInteractionResultGuard>;

export type PasswordIdentifierPayload = EmailPasswordPayload

export type UserIdentity =
    | { email: string }
    | { connectorId: string, userInfo: string }