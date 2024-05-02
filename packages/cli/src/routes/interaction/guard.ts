import {z} from "zod";
import {eventGuard, profileGuard} from "@astoniq/loam-schemas";
import {socialUserInfoGuard} from "@astoniq/loam-connector-kit";


export const accountIdIdentifierGuard = z.object({
    key: z.literal('accountId'),
    value: z.string()
})

export type AccountIdIdentifier = z.infer<typeof accountIdIdentifierGuard>

export const verifiedEmailIdentifierGuard = z.object({
    key: z.literal('emailVerified'),
    value: z.string(),
});

export type VerifiedEmailIdentifier = z.infer<typeof verifiedEmailIdentifierGuard>

export const socialIdentifierGuard = z.object({
    key: z.literal('social'),
    connectorId: z.string(),
    userInfo: socialUserInfoGuard,
});

export type SocialIdentifier = z.infer<typeof socialIdentifierGuard>;

export const identifierGuard = z.discriminatedUnion('key', [
    accountIdIdentifierGuard,
    verifiedEmailIdentifierGuard,
    socialIdentifierGuard
])
export const anonymousInteractionResultGuard = z.object({
    event: eventGuard,
    profile: profileGuard.optional(),
    accountId: z.string().optional(),
    identifiers: z.array(identifierGuard).optional(),
})

export const forgotPasswordProfileGuard = z.object({
    password: z.string()
})