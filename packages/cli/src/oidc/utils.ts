import {ApplicationType, GrantType} from "@astoniq/loam-schemas";
import {AllClientMetadata, ClientAuthMethod, SigningAlgorithm} from "oidc-provider";
import {conditional} from "@astoniq/essentials";

export const getConstantClientMetadata = (
    type: ApplicationType,
    jwkSigningAlg: SigningAlgorithm = 'ES384'): AllClientMetadata => {

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
        authorization_signed_response_alg: jwkSigningAlg,
        userinfo_signed_response_alg: jwkSigningAlg,
        id_token_signed_response_alg: jwkSigningAlg,
        introspection_signed_response_alg: jwkSigningAlg
    }
}