import {z} from 'zod';

export const protectedAppMetadataGuard = z.object({
    host: z.string(),
    origin: z.string(),
    sessionDuration: z.number(),
    pageRules: z.array(
        z.object({
                path: z.string()
            }
        )
    )
})

export type ProtectedAppMetadata = z.infer<typeof protectedAppMetadataGuard>;