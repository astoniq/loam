import {z} from "zod";


export const accountIdIdentifierGuard = z.object({
    key: z.literal('accountId'),
    value: z.string()
})

export const identifierGuard = z.discriminatedUnion('key', [
    accountIdIdentifierGuard
])