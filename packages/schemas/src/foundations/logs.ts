import {z} from 'zod';
import {PasswordPolicy, passwordPolicyGuard} from "@astoniq/loam-core-kit";
import {DeepPartial} from "@astoniq/essentials";

export enum LogResult {
    Success = 'Success',
    Error = 'Error'
}

export const logContextPayloadGuard = z
    .object({
        key: z.string(),
        result: z.nativeEnum(LogResult),
        error: z.record(z.string(), z.unknown()).or(z.string()).optional(),
        ip: z.string().optional(),
        userAgent: z.string().optional(),
        userId: z.string().optional(),
        applicationId: z.string().optional(),
        sessionId: z.string().optional()
    })

export type PartialPasswordPolicy = DeepPartial<PasswordPolicy>;

export const partialPasswordPolicyGuard = passwordPolicyGuard.deepPartial();

export type LogContextPayload = z.infer<typeof logContextPayloadGuard>;