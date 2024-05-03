import { z } from 'zod';
import {BaseConnector, ConnectorType} from "./foundation.js";

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);

export type Json = JsonObject | JsonArray | string | number | boolean | null;
export type JsonArray = Json[];
export type JsonObject = {
    [key: string]: Json;
};

export const jsonGuard: z.ZodType<Json> = z.lazy(() =>
    z.union([literalSchema, z.array(jsonGuard), z.record(jsonGuard)])
);

export const jsonObjectGuard = z.record(jsonGuard);

export type GetAuthorizationUri = (
    payload: {
        state: string;
        redirectUri: string;
        connectorId: string;
        connectorFactoryId: string;
        jti: string;
        headers: { userAgent?: string };
    },
    setSession: SetSession
) => Promise<string>;


export type SocialUserInfo = {
    id: string;
    email?: string;
    phone?: string;
    name?: string;
    avatar?: string;
    rawData?: Json;
};

export const socialUserInfoGuard = z.object({
    id: z.string(),
    email: z.string().optional(),
    phone: z.string().optional(),
    name: z.string().optional(),
    avatar: z.string().optional(),
    rawData: jsonGuard.optional(),
}) satisfies z.ZodType<SocialUserInfo>;

export type GetUserInfo = (data: unknown, getSession: GetSession) => Promise<SocialUserInfo>;

export const connectorSessionGuard = z
    .object({
        nonce: z.string(),
        redirectUri: z.string(),
        connectorId: z.string(),
        connectorFactoryId: z.string(),
        jti: z.string(),
        state: z.string(),
    })
    .partial();

export type ConnectorSession = z.infer<typeof connectorSessionGuard>;

export type GetSession = () => Promise<ConnectorSession>;

export type SetSession = (storage: ConnectorSession) => Promise<void>;

export type SocialConnector = BaseConnector<ConnectorType.Social> & {
    getAuthorizationUri: GetAuthorizationUri;
    getUserInfo: GetUserInfo;
};