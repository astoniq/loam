import {Role, RoleType} from "@astoniq/loam-schemas";
import {z} from "zod";
import {Guard} from "@/types/index.js";

export const roleGuard: Guard<Role> = z.object({
    id: z.string().min(1).max(21),
    name: z.string().min(1).max(128),
    description: z.string().min(1).max(128),
    type: z.nativeEnum(RoleType),
});
