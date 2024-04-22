import { z } from 'zod';
import {UsersPasswordEncryptionMethod} from "@/types/index.js";

const createUserGuard = z.object({
    id: z.string().min(1).max(12),
    username: z.string().max(128).nullable().optional(),
    primaryEmail: z.string().max(128).nullable().optional(),
    primaryPhone: z.string().max(128).nullable().optional(),
    passwordEncrypted: z.string().max(128).nullable().optional(),
    passwordEncryptionMethod: z.nativeEnum(UsersPasswordEncryptionMethod).nullable().optional(),
    name: z.string().max(128).nullable().optional(),
    avatar: z.string().max(2048).nullable().optional(),
    isSuspended: z.boolean().optional(),
    lastSignInAt: z.number().nullable().optional(),
    createdAt: z.number().optional(),
});

export type CreateUser = z.infer<typeof createUserGuard>;

const userGuard = z.object({
    id: z.string().min(1).max(12),
    username: z.string().max(128).nullable(),
    primaryEmail: z.string().max(128).nullable(),
    primaryPhone: z.string().max(128).nullable(),
    passwordEncrypted: z.string().max(128).nullable(),
    passwordEncryptionMethod: z.nativeEnum(UsersPasswordEncryptionMethod).nullable(),
    name: z.string().max(128).nullable(),
    avatar: z.string().max(2048).nullable(),
    isSuspended: z.boolean(),
    lastSignInAt: z.number().nullable(),
    createdAt: z.number(),
});

export type User = z.infer<typeof userGuard>;