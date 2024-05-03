import { z } from 'zod';
import {emailRegEx} from "@astoniq/loam-core-kit";
import {jsonObjectGuard, MfaFactor} from "../foundations/index.js";

import type {
    EmailVerificationCodePayload,
} from './verification-code.js';
import {
    emailVerificationCodePayloadGuard,
} from './verification-code.js';

export const emailPasswordPayloadGuard = z.object({
    email: z.string().min(1),
    password: z.string().min(1),
});
export type EmailPasswordPayload = z.infer<typeof emailPasswordPayloadGuard>;

export const socialConnectorPayloadGuard = z.object({
    connectorId: z.string(),
    connectorData: jsonObjectGuard,
});
export type SocialConnectorPayload = z.infer<typeof socialConnectorPayloadGuard>;

export const socialEmailPayloadGuard = z.object({
    connectorId: z.string(),
    email: z.string(),
});

export type SocialEmailPayload = z.infer<typeof socialEmailPayloadGuard>;

export enum InteractionEvent {
    SignIn = 'SignIn',
    Register = 'Register',
    ForgotPassword = 'ForgotPassword',
}

export const eventGuard = z.nativeEnum(InteractionEvent);

export const identifierPayloadGuard = z.union([
    emailPasswordPayloadGuard,
    emailVerificationCodePayloadGuard,
    socialEmailPayloadGuard,
    socialConnectorPayloadGuard,
]);

export type IdentifierPayload =
    | EmailPasswordPayload
    | EmailVerificationCodePayload
    | SocialEmailPayload
    | SocialConnectorPayload;

export enum MissingProfile {
    email = 'email'
}

export const profileGuard = z.object({
    email: z.string().regex(emailRegEx).optional(),
    connectorId: z.string().optional(),
    password: z.string().optional(),
});

export type Profile = z.infer<typeof profileGuard>;

export const pendingTotpGuard = z.object({
    type: z.literal(MfaFactor.TOTP),
    secret: z.string(),
});

export type PendingTotp = z.infer<typeof pendingTotpGuard>;

export const pendingBackupCodeGuard = z.object({
    type: z.literal(MfaFactor.BackupCode),
    codes: z.array(z.string()),
});

export type PendingBackupCode = z.infer<typeof pendingBackupCodeGuard>;

export const pendingMfaGuard = z.discriminatedUnion('type', [
    pendingTotpGuard,
    pendingBackupCodeGuard,
]);

export type PendingMfa = z.infer<typeof pendingMfaGuard>;

export const bindTotpGuard = pendingTotpGuard;

export type BindTotp = z.infer<typeof bindTotpGuard>;

export const bindBackupCodeGuard = pendingBackupCodeGuard;

export type BindBackupCode = z.infer<typeof bindBackupCodeGuard>;

export const bindMfaGuard = z.discriminatedUnion('type', [
    bindTotpGuard,
    bindBackupCodeGuard,
]);

export type BindMfa = z.infer<typeof bindMfaGuard>;