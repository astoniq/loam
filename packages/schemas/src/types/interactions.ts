import { z } from 'zod';
import {emailRegEx, phoneRegEx} from "@astoniq/loam-core-kit";
import {jsonObjectGuard} from "@/foundations/index.js";

export const emailPasswordPayloadGuard = z.object({
    email: z.string().min(1),
    password: z.string().min(1),
});
export type EmailPasswordPayload = z.infer<typeof emailPasswordPayloadGuard>;

export const phonePasswordPayloadGuard = z.object({
    phone: z.string().min(1),
    password: z.string().min(1),
});
export type PhonePasswordPayload = z.infer<typeof phonePasswordPayloadGuard>;

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
    phonePasswordPayloadGuard,
    socialConnectorPayloadGuard,
]);

export type IdentifierPayload =
    | EmailPasswordPayload
    | SocialConnectorPayload;

export enum MissingProfile {
    email = 'email',
    phone = 'phone',
    password = 'password',
    emailOrPhone = 'emailOrPhone',
}

export const profileGuard = z.object({
    email: z.string().regex(emailRegEx).optional(),
    phone: z.string().regex(phoneRegEx).optional(),
    connectorId: z.string().optional(),
    password: z.string().optional(),
});

export type Profile = z.infer<typeof profileGuard>;
