import {NormalizeKeyPaths} from "@astoniq/essentials";
import {z} from "zod";
import {builtInLanguageTagGuard} from "@/options";

export interface Errors {
    application: {
        invalid_type: string;
        role_exists: string;
        invalid_role_type: string;
        invalid_third_party_application_type: string;
        third_party_application_only: string;
        user_consent_scopes_not_found: string;
        consent_management_api_scopes_not_allowed: string;
        protected_app_metadata_is_required: string;
        protected_app_not_configured: string;
        cloudflare_unknown_error: string;
        protected_application_only: string;
        protected_application_misconfigured: string;
        protected_application_subdomain_exists: string;
        invalid_subdomain: string;
        custom_domain_not_found: string;
        should_delete_custom_domains_first: string;
    }
}

export interface Translation {
    oidc: {
        logout_success: string;
    }
}

export type LocalePhrase = {
    translation: Translation
    errors: Errors
}

export type I18nKey = NormalizeKeyPaths<Translation>;

export type BuiltInLanguageTag = z.infer<typeof builtInLanguageTagGuard>;

export type LoamErrorCode = NormalizeKeyPaths<Errors>;
export type LoamErrorI18nKey = `errors:${LoamErrorCode}`;


export type Resources = Record<BuiltInLanguageTag, LocalePhrase>;
