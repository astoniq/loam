import {z} from "zod";
import {RoleType} from "@/types/index.js";

export const createRoleGuard = z.object({
    id: z.string().min(1).max(21),
    name: z.string().min(1).max(128),
    description: z.string().min(1).max(128),
    type: z.nativeEnum(RoleType).optional(),
});

export type CreateRole = z.infer<typeof createRoleGuard>;

export const roleGuard = z.object({
    id: z.string().min(1).max(21),
    name: z.string().min(1).max(128),
    description: z.string().min(1).max(128),
    type: z.nativeEnum(RoleType),
});

export type Role = z.infer<typeof roleGuard>;