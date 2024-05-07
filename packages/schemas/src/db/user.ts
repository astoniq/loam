import { z } from 'zod';
import {UsersPasswordEncryptionMethod} from "../types/index.js";

export const createUserGuard = z.object({
    id: z.string().min(1).max(12),
    email: z.string().max(128).nullable().optional(),
    passwordEncrypted: z.string().max(128).nullable().optional(),
    passwordEncryptionMethod: z.nativeEnum(UsersPasswordEncryptionMethod).nullable().optional(),
    isSuspended: z.boolean().optional(),
    lastSignInAt: z.number().nullable().optional(),
    createdAt: z.number().optional(),
});

export type CreateUser = z.infer<typeof createUserGuard>;

export const userGuard = z.object({
    id: z.string().min(1).max(12),
    email: z.string().max(128).nullable(),
    passwordEncrypted: z.string().max(128).nullable(),
    passwordEncryptionMethod: z.nativeEnum(UsersPasswordEncryptionMethod).nullable(),
    isSuspended: z.boolean(),
    lastSignInAt: z.number().nullable(),
    createdAt: z.number(),
});

export type User = z.infer<typeof userGuard>;