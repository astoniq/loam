import {z} from 'zod';
import {logContextPayloadGuard} from "@/foundations/index.js";

export const createLogGuard = z.object({
    id: z.string().min(1).max(21),
    key: z.string().min(1).max(128),
    payload: logContextPayloadGuard.optional(),
    createdAt: z.number().optional(),
});

export type CreateLog = z.infer<typeof createLogGuard>;

export const logGuard = z.object({
    id: z.string().min(1).max(21),
    key: z.string().min(1).max(128),
    payload: logContextPayloadGuard,
    createdAt: z.number(),
});

export type Log = z.infer<typeof logGuard>;
