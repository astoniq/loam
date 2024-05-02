import {z} from "zod";
import {
    accountIdIdentifierGuard,
    anonymousInteractionResultGuard,
    identifierGuard
} from "@/routes/interaction/guard.js";
import {BindMfa, EmailPasswordPayload, InteractionEvent, Profile, SocialEmailPayload} from "@astoniq/loam-schemas";

export type AccountIdIdentifier = z.infer<typeof accountIdIdentifierGuard>;

export type Identifier = z.infer<typeof identifierGuard>

export type  SocialVerifiedIdentifierPayload = SocialEmailPayload

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

export type VerifiedRegisterInteractionResult = {
    event: InteractionEvent.Register;
    profile?: Profile;
    identifiers?: Identifier[];
    bindMfas?: BindMfa[];
    pendingAccountId?: string;
    mfaSkipped?: boolean;
};

export type VerifiedInteractionResult =
    | VerifiedSignInInteractionResult
    | VerifiedRegisterInteractionResult
    | VerifiedForgotPasswordInteractionResult


export type AnonymousInteractionResult = z.infer<typeof anonymousInteractionResultGuard>;

export type PasswordIdentifierPayload = EmailPasswordPayload

export type UserIdentity =
    | { email: string }
    | { connectorId: string, userInfo: string }