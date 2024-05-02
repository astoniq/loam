import {z} from 'zod';

export const createPasscodeGuard = z.object({
    id: z.string().min(1).max(21),
    interactionJti: z.string().max(128).nullable().optional(),
    email: z.string().max(128).nullable().optional(),
    type: z.string().min(1).max(32),
    code: z.string().min(1).max(6),
    consumed: z.boolean().optional(),
    tryCount: z.number().optional(),
    createdAt: z.number().optional(),
});

export type CreatePasscode = z.infer<typeof createPasscodeGuard>;

export const passcodeGuard = z.object({
    id: z.string().min(1).max(21),
    interactionJti: z.string().max(128).nullable(),
    email: z.string().max(128).nullable(),
    type: z.string().min(1).max(32),
    code: z.string().min(1).max(6),
    consumed: z.boolean(),
    tryCount: z.number(),
    createdAt: z.number(),
});

export type Passcode = z.infer<typeof passcodeGuard>;
