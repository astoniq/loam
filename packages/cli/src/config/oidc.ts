import {Config} from "@/config/config.js";
import {appendPath} from "@astoniq/essentials";


export type OidcConfig = ReturnType<typeof loadOidcConfig>

export const loadOidcConfig = (config: Config) => {

    const endpoint = new URL(config.endpoint);
    const issuer = appendPath(endpoint, '/oidc');

    return {
        endpoint,
        issuer,
    }
}