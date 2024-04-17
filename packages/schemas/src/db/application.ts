import { z } from 'zod';
import {customClientMetadataGuard, oidcClientMetadataGuard, protectedAppMetadataGuard} from "@/foundations/index.js";
import {ApplicationType} from "@/types/index.js";

const createApplicationGuard = z.object({
    id: z.string().min(1).max(21),
    name: z.string().min(1).max(256),
    secret: z.string().min(1).max(64),
    description: z.string().nullable().optional(),
    type: z.nativeEnum(ApplicationType),
    oidcClientMetadata: oidcClientMetadataGuard,
    customClientMetadata: customClientMetadataGuard.optional(),
    protectedAppMetadata: protectedAppMetadataGuard.nullable().optional(),
    isThirdParty: z.boolean().optional(),
    createdAt: z.number().optional(),
});

export type CreateApplication = z.infer<typeof createApplicationGuard>;

const applicationGuard = z.object({
    id: z.string().min(1).max(21),
    name: z.string().min(1).max(256),
    secret: z.string().min(1).max(64),
    description: z.string().nullable(),
    type: z.nativeEnum(ApplicationType),
    oidcClientMetadata: oidcClientMetadataGuard,
    customClientMetadata: customClientMetadataGuard,
    protectedAppMetadata: protectedAppMetadataGuard.nullable(),
    isThirdParty: z.boolean(),
    createdAt: z.number(),
});

export type Application = z.infer<typeof applicationGuard>;