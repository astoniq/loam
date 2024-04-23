import {Config} from "@/config/config.js";
import {appendPath} from "@astoniq/essentials";
import {SigningAlgorithm} from "oidc-provider";


export type OidcConfig = ReturnType<typeof loadOidcConfig>

export const loadOidcConfig = (config: Config) => {

    const endpoint = new URL(config.endpoint);
    const issuer = appendPath(endpoint, '/oidc');

    const jwkSigningAlg: SigningAlgorithm = 'ES384'

    return {
        endpoint,
        jwkSigningAlg,
        issuer,
    }
}