import { z } from 'zod';

export const createUserRoleGuard = z.object({
    id: z.string().min(1).max(21),
    userId: z.string().min(1).max(21),
    roleId: z.string().min(1).max(21),
});

export type CreateUserRole = z.infer<typeof createUserRoleGuard>;

export const userRoleGuard = z.object({
    id: z.string().min(1).max(21),
    userId: z.string().min(1).max(21),
    roleId: z.string().min(1).max(21),
});

export type UserRole = z.infer<typeof userRoleGuard>;