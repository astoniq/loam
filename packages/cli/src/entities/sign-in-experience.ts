import {Entity} from "@/types/index.js";
import {SignInExperience} from "@astoniq/loam-schemas";

export const signInExperienceEntity: Entity<SignInExperience> =
    Object.freeze({
        table: 'sign_in_experiences',
        tableSingular: 'sign_in_experience',
        fields: {
            id: 'id',
            color: 'color',
            branding: 'branding',
            languageInfo: 'language_info',
            termsOfUseUrl: 'terms_of_use_url',
            privacyPolicyUrl: 'privacy_policy_url',
            signIn: 'sign_in',
            signUp: 'sign_up',
            socialSignInConnectorTargets: 'social_sign_in_connector_targets',
            signInMode: 'sign_in_mode',
            passwordPolicy: 'password_policy',
            mfa: 'mfa',
            singleSignOnEnabled: 'single_sign_on_enabled',
        },
        fieldKeys: [
            'id',
            'color',
            'branding',
            'languageInfo',
            'termsOfUseUrl',
            'privacyPolicyUrl',
            'signIn',
            'signUp',
            'socialSignInConnectorTargets',
            'signInMode',
            'passwordPolicy',
            'mfa',
            'singleSignOnEnabled',
        ] as const,
    });