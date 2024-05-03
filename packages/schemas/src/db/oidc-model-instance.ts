import {z} from "zod";
import {oidcModelInstancePayloadGuard} from "../foundations/index.js";

export const createOidcModelInstanceGuard = z.object({
    modelName: z.string().min(1).max(64),
    id: z.string().min(1).max(128),
    payload: oidcModelInstancePayloadGuard,
    expiresAt: z.number(),
    consumedAt: z.number().nullable().optional(),
});

export type CreateOidcModelInstance = z.infer<typeof createOidcModelInstanceGuard>;

export const oidcModelInstanceGuard = z.object({
    modelName: z.string().min(1).max(64),
    id: z.string().min(1).max(128),
    payload: oidcModelInstancePayloadGuard,
    expiresAt: z.number(),
    consumedAt: z.number().nullable(),
});

export const oidcModelInstanceQueryResultGuard = oidcModelInstanceGuard.pick({
    payload: true,
    consumedAt: true
})

export type OidcModelInstanceQueryResult = z.infer<typeof oidcModelInstanceQueryResultGuard>;

export type OidcModelInstance = z.infer<typeof oidcModelInstanceGuard>;