import { z } from 'zod';
import {emailRegEx} from "@astoniq/loam-core-kit";
import {jsonObjectGuard} from "@/foundations/index.js";

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

export enum InteractionEvent {
    SignIn = 'SignIn',
    Register = 'Register',
    ForgotPassword = 'ForgotPassword',
}

export const eventGuard = z.nativeEnum(InteractionEvent);

export const identifierPayloadGuard = z.union([
    emailPasswordPayloadGuard,
    emailVerificationCodePayloadGuard,
    socialConnectorPayloadGuard,
]);

export type IdentifierPayload =
    | EmailPasswordPayload
    | EmailVerificationCodePayload
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
