import {z} from "zod";
import {eventGuard, profileGuard} from "@astoniq/loam-schemas";


export const accountIdIdentifierGuard = z.object({
    key: z.literal('accountId'),
    value: z.string()
})

export const verifiedEmailIdentifierGuard = z.object({
    key: z.literal('emailVerified'),
    value: z.string(),
});

export const identifierGuard = z.discriminatedUnion('key', [
    accountIdIdentifierGuard,
    verifiedEmailIdentifierGuard
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