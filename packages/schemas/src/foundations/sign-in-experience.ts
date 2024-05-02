import { z } from 'zod';
import {hexColorRegEx} from "@astoniq/loam-core-kit";
import {languageTagGuard} from "@astoniq/loam-language-kit";

export const colorGuard = z.object({
    primaryColor: z.string().regex(hexColorRegEx),
    isDarkModeEnabled: z.boolean(),
    darkPrimaryColor: z.string().regex(hexColorRegEx)
})

export type Color = z.infer<typeof colorGuard>;

export const brandingGuard = z.object({
    logoUrl: z.string().url().optional(),
    darkLogoUrl: z.string().url().optional(),
    favicon: z.string().url().optional()
})

export type Branding = z.infer<typeof brandingGuard>;

export const languageInfoGuard = z.object({
    autoDetect: z.boolean(),
    fallbackLanguage: languageTagGuard
})

export type LanguageInfo = z.infer<typeof languageInfoGuard>;

export enum SignInIdentifier {
    Email = 'email'
}

export const signUpGuard = z.object({
    identifiers: z.nativeEnum(SignInIdentifier).array(),
    password: z.boolean(),
    verify: z.boolean()
})

export type SignUp = z.infer<typeof signUpGuard>;

export const signInGuard = z.object({
    methods: z
        .object({
            identifier: z.nativeEnum(SignInIdentifier),
            password: z.boolean(),
            verificationCode: z.boolean(),
            isPasswordPrimary: z.boolean()
        })
        .array()
})

export type SignIn = z.infer<typeof signInGuard>;

export const connectorTargetsGuard = z.string().array();

export type ConnectorTargets = z.infer<typeof connectorTargetsGuard>;

export enum MfaFactor {
    TOTP = 'Totp',
    BackupCode = 'BackupCode'
}

export const mfaFactorsGuard = z.nativeEnum(MfaFactor).array()

export type MfaFactors = z.infer<typeof mfaFactorsGuard>;

export enum MfaPolicy {
    UserControlled = 'UserControlled',
    Mandatory = 'Mandatory'
}

export const mfaGuard = z.object({
    factors: mfaFactorsGuard,
    policy: z.nativeEnum(MfaPolicy)
})

export type Mfa = z.infer<typeof mfaGuard>