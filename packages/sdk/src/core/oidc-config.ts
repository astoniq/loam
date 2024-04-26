import {KeysToCamelCase} from "@astoniq/essentials";
import {Requester} from "@/types/index.js";
import camelcaseKeys from "camelcase-keys";


type OidcConfigSnakeCaseResponse = {
    authorization_endpoint: string;
    token_endpoint: string;
    userinfo_endpoint: string;
    end_session_endpoint: string;
    revocation_endpoint: string;
    jwks_uri: string;
    issuer: string;
}

export type OidcConfigResponse = KeysToCamelCase<OidcConfigSnakeCaseResponse>;

export const fetchOidcConfig = async (
    endpoint: string,
    requester: Requester
): Promise<OidcConfigResponse> => {

    const snakeCaseOidcConfigResponse = await requester<OidcConfigSnakeCaseResponse>(
        endpoint
    )
    return camelcaseKeys(snakeCaseOidcConfigResponse)
}