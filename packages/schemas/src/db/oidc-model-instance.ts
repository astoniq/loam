import {z} from "zod";
import {oidcModelInstancePayloadGuard} from "@/foundations/oidc-module.js";


const createOidcModelInstanceGuard = z.object({
    modelName: z.string().min(1).max(64),
    id: z.string().min(1).max(128),
    payload: oidcModelInstancePayloadGuard,
    expiresAt: z.number(),
    consumedAt: z.number().nullable().optional(),
});

export type CreateOidcModelInstance = z.infer<typeof createOidcModelInstanceGuard>;

const oidcModelInstanceGuard = z.object({
    modelName: z.string().min(1).max(64),
    id: z.string().min(1).max(128),
    payload: oidcModelInstancePayloadGuard,
    expiresAt: z.number(),
    consumedAt: z.number().nullable(),
});

export type OidcModelInstance = z.infer<typeof oidcModelInstanceGuard>;