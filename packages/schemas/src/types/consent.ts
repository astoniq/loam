import {applicationGuard, resourceGuard, scopeGuard, userGuard} from "../db/index.js";
import {z} from "zod";

export const publicUserInfoGuard = userGuard.pick({
    id: true,
    email: true
})

export type PublicUserInfo = z.infer<typeof publicUserInfoGuard>;

export const publicApplicationInfoGuard = applicationGuard.pick({
    id: true,
    name: true
})

export type PublicApplicationInfo = z.infer<typeof publicApplicationInfoGuard>;

export const missingResourceScopesGuard = z.object({
    resource: resourceGuard.pick({name: true}).extend({id: z.string()}),
    scopes: scopeGuard.pick({id: true, name: true, description: true}).array()
})

export type MissingResourceScopes = z.infer<typeof missingResourceScopesGuard>;

export const missingOIDCScopeGuard = z.string();

export type MissingOIDCScope = z.infer<typeof missingOIDCScopeGuard>;

export const consentInfoResponseGuard = z.object({
    application: publicApplicationInfoGuard,
    user: publicUserInfoGuard,
    missingOIDCScope: missingOIDCScopeGuard.array().optional(),
    missingResourceScopes: missingResourceScopesGuard.array().optional(),
    redirectUri: z.string()
})

export type ConsentInfoResponse = z.infer<typeof consentInfoResponseGuard>