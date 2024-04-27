import { z } from 'zod';
import {
    brandingGuard, colorGuard, connectorTargetsGuard,
    languageInfoGuard,
    mfaGuard,
    partialPasswordPolicyGuard,
    signInGuard,
    signUpGuard
} from "@/foundations/index.js";
import {SignInMode} from "@/types/index.js";

export const createSignInExperienceGuard = z.object({
    id: z.string().min(1).max(21),
    color: colorGuard,
    branding: brandingGuard,
    languageInfo: languageInfoGuard,
    termsOfUseUrl: z.string().max(2048).nullable().optional(),
    privacyPolicyUrl: z.string().max(2048).nullable().optional(),
    signIn: signInGuard,
    signUp: signUpGuard,
    socialSignInConnectorTargets: connectorTargetsGuard.optional(),
    signInMode: z.nativeEnum(SignInMode).optional(),
    passwordPolicy: partialPasswordPolicyGuard.optional(),
    mfa: mfaGuard.optional(),
    singleSignOnEnabled: z.boolean().optional(),
});

export type CreateSignInExperience = z.infer<typeof createSignInExperienceGuard>;

export const signInExperienceGuard = z.object({
    id: z.string().min(1).max(21),
    color: colorGuard,
    branding: brandingGuard,
    languageInfo: languageInfoGuard,
    termsOfUseUrl: z.string().max(2048).nullable(),
    privacyPolicyUrl: z.string().max(2048).nullable(),
    signIn: signInGuard,
    signUp: signUpGuard,
    socialSignInConnectorTargets: connectorTargetsGuard,
    signInMode: z.nativeEnum(SignInMode),
    passwordPolicy: partialPasswordPolicyGuard,
    mfa: mfaGuard,
    singleSignOnEnabled: z.boolean(),
});

export type SignInExperience = z.infer<typeof signInExperienceGuard>;