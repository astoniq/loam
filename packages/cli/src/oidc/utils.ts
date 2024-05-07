import {
    ApplicationType,
    experience,
    ExtraParamsKey,
    ExtraParamsObject,
    FirstScreen,
    GrantType
} from "@astoniq/loam-schemas";
import {AllClientMetadata, ClientAuthMethod} from "oidc-provider";
import {conditional} from "@astoniq/essentials";
import {OidcConfig} from "@/config/index.js";
import * as path from "path";

export const getConstantClientMetadata = (
    type: ApplicationType,
    config: OidcConfig): AllClientMetadata => {

    const getTokenEndpointAuthMethod = (): ClientAuthMethod => {
        switch (type) {
            case ApplicationType.Native:
            case ApplicationType.SPA:
                return 'none';
            default:
                return 'client_secret_basic'
        }
    }

    return {
        application_type: type === ApplicationType.Native ? 'native' : "web",
        grant_types:
            type === ApplicationType.MachineToMachine
                ? [GrantType.ClientCredentials]
                : [GrantType.AuthorizationCode, GrantType.RefreshToken],
        token_endpoint_auth_method: getTokenEndpointAuthMethod(),
        response_types: conditional(type === ApplicationType.MachineToMachine && []),
        authorization_signed_response_alg: config.jwkSigningAlg,
        userinfo_signed_response_alg: config.jwkSigningAlg,
        id_token_signed_response_alg: config.jwkSigningAlg,
        introspection_signed_response_alg: config.jwkSigningAlg
    }
}

export const buildLoginPromptUrl = (params: ExtraParamsObject): string => {

    const firstScreenKey =
        params[ExtraParamsKey.FirstScreen] ??
        params[ExtraParamsKey.InteractionMode] ??
        FirstScreen.SignIn;

    const firstScreen =
        firstScreenKey === 'signUp'
            ? experience.routes.register
            : experience.routes[firstScreenKey];

    const directSignIn = params[ExtraParamsKey.DirectSignIn];
    const searchParams = new URLSearchParams();

    const getSearchParamString = () => (searchParams.size > 0 ? `?${searchParams.toString()}` : '');

    if (directSignIn) {
        searchParams.append('fallback', firstScreen);
        const [method, target] = directSignIn.split(':');
        return path.join('direct', method ?? '', target ?? '') + getSearchParamString();
    }

    return firstScreen + getSearchParamString();
};