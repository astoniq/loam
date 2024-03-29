
export interface Errors {
    auth: {
        authorization_header_missing: string;
        authorization_token_type_not_supported: string;
        unauthorized: string;
        forbidden: string;
        expected_role_not_found: string;
        jwt_sub_missing: string;
        require_re_authentication: string;
    },
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
    guard: {
        invalid_input: string;
    },
    entity: {
        invalid_input: string;
        create_failed: string;
        db_constraint_violated: string;
        not_exists: string;
        not_exists_with_id: string;
        not_found: string;
        relation_foreign_key_not_found: string;
        unique_integrity_violation: string;
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