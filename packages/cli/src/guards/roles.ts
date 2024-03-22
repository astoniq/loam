import {CreateRole, Role, RoleType} from "@astoniq/loam-schemas";
import {z} from "zod";
import {Guard} from "@/types";

const createRoleGuard: Guard<CreateRole> = z.object({
    tenantId: z.string().max(21).optional(),
    id: z.string().min(1).max(21),
    name: z.string().min(1).max(128),
    description: z.string().min(1).max(128),
    type: z.nativeEnum(RoleType).optional(),
});

export const roleGuard: Guard<Role> = z.object({
    tenantId: z.string().max(21),
    id: z.string().min(1).max(21),
    name: z.string().min(1).max(128),
    description: z.string().min(1).max(128),
    type: z.nativeEnum(RoleType),
});