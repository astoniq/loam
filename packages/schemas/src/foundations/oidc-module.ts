import { z } from 'zod';
import {validateRedirectUrl} from "@astoniq/loam-core-kit";

export const oidcModelInstancePayloadGuard =
    z.object({
        userCode: z.string().optional(),
        uid: z.string().optional(),
        grantId: z.string().optional()
    })

export type OidcModelInstancePayload = z.infer<typeof oidcModelInstancePayloadGuard>;

export const oidcClientMetadataGuard = z.object({
    redirectUris: z
        .string()
        .refine((url) => validateRedirectUrl(url, "web"))
        .or(z.string().refine((url) => validateRedirectUrl(url, "mobile")))
        .array(),
    postLogoutRedirectUris: z.string().url().array(),
    logoUri: z.string().optional()
})

export type OidcClientMetadata = z.infer<typeof oidcClientMetadataGuard>;

export enum CustomClientMetadataKey {
    CorsAllowedOrigins = 'corsAllowedOrigins',
    IdTokenTtl = 'idTokenTtl',
    RefreshTokenTtl = 'refreshTokenTtl',
    RefreshTokenTtlInDays = 'refreshTokenTtlInDays',
    AlwaysIssueRefreshToken = 'alwaysIssueRefreshToken',
    RotateRefreshToken = 'rotateRefreshToken'
}

export const customClientMetadataGuard = z.object({
    [CustomClientMetadataKey.CorsAllowedOrigins]: z.string().min(1).array().optional(),
    [CustomClientMetadataKey.IdTokenTtl]: z.number().optional(),
    [CustomClientMetadataKey.RefreshTokenTtl]: z.number().optional(),
    [CustomClientMetadataKey.RefreshTokenTtlInDays]: z.number().int().min(1).max(90).optional(),
    [CustomClientMetadataKey.AlwaysIssueRefreshToken]: z.boolean().optional(),
    [CustomClientMetadataKey.RotateRefreshToken]: z.boolean().optional()
})

export type CustomClientMetadata = z.infer<typeof customClientMetadataGuard>