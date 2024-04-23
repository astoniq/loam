import {z} from 'zod';

export const resourceGuard = z.object({
    id: z.string().min(1).max(21),
    name: z.string().min(1),
    indicator: z.string().min(1),
})

export type Resource = z.infer<typeof resourceGuard>;

export const createResourceGuard = z.object({
    id: z.string().min(1).max(21),
    name: z.string().min(1),
    indicator: z.string().min(1),
})

export type CreateResource = z.infer<typeof createResourceGuard>;