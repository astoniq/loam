import {Guard} from "@/types/index.js";
import {CreateResource, Resource} from "@astoniq/loam-schemas";
import {z} from 'zod';

export const resourceGuard: Guard<Resource> = z.object({
    id: z.string().min(1).max(21),
    name: z.string().min(1),
})

export const createResourceGuard: Guard<CreateResource> = z.object({
    id: z.string().min(1).max(21),
    name: z.string().min(1)
})