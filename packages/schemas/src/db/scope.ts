import { z } from 'zod';

const createScopeGuard = z.object({
    id: z.string().min(1).max(21),
    resourceId: z.string().min(1).max(21),
    name: z.string().min(1).max(256),
    description: z.string().min(1),
    createdAt: z.number().optional(),
});

export type CreateScope = z.infer<typeof createScopeGuard>;

const scopeGuard = z.object({
    id: z.string().min(1).max(21),
    resourceId: z.string().min(1).max(21),
    name: z.string().min(1).max(256),
    description: z.string().min(1),
    createdAt: z.number(),
});

export type Scope = z.infer<typeof scopeGuard>;