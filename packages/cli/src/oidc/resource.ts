import {OidcConfig} from "@/config/index.js";
import {ResourceServer} from "oidc-provider";


export const getSharedResourceServerData = (
    config: OidcConfig
): Pick<ResourceServer, 'accessTokenFormat' | 'jwt'> => ({
    accessTokenFormat: 'jwt',
    jwt: {
        sign: { alg: config.jwkSigningAlg },
    },
});
