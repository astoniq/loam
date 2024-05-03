import {isArbitraryObject} from "./arbitrary-object.js";
import {urlSafeBase64} from "@astoniq/essentials";

export type AccessTokenClaims = {
    jti?: string;
    iss?: string;
    sub?: string;
    aud?: string;
    exp?: number;
    iat?: number;
    client_id?: string;
    scope?: string;
}

function assertAccessTokenClaims(data: unknown): asserts data is AccessTokenClaims {
    if (!isArbitraryObject(data)) {
        throw new TypeError('AccessToken is expected to be an object');
    }

    for (const key of ['jti', 'iss', 'sub', 'aud', 'client_id', 'scope']) {
        if (data[key] === undefined) {
            continue;
        }

        if (typeof data[key] !== 'string' && data[key] !== null) {
            throw new TypeError(`At path: AccessToken.${key}: expected null or a string`);
        }
    }

    for (const key of ['exp', 'iat']) {
        if (data[key] === undefined) {
            continue;
        }

        if (typeof data[key] !== 'number' && data[key] !== null) {
            throw new TypeError(`At path: AccessToken.${key}: expected null or a number`);
        }
    }
}

export const decodeAccessToken = (accessToken: string): AccessTokenClaims => {
    const { 1: encodedPayload } = accessToken.split('.');

    if (!encodedPayload) {
        // Non-JWT format token string
        return {};
    }

    const json = urlSafeBase64.decode(encodedPayload);
    const accessTokenClaims: unknown = JSON.parse(json);
    assertAccessTokenClaims(accessTokenClaims);

    return accessTokenClaims;
};