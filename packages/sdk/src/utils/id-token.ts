import {isArbitraryObject} from "@/utils/arbitrary-object.js";
import {urlSafeBase64} from "@astoniq/essentials";
import {LoamError} from "@/errors/index.js";


export type IdTokenClaims = {
    /** Issuer of this token. */
    iss: string;
    /** Subject (the user ID) of this token. */
    sub: string;
    /** Audience (the client ID) of this token. */
    aud: string;
    /** Expiration time of this token. */
    exp: number;
    /** Time at which this token was issued. */
    iat: number;
};

function assertIdTokenClaims(data: unknown): asserts data is IdTokenClaims {
    if (!isArbitraryObject(data)) {
        throw new TypeError('IdToken is expected to be an object');
    }

    for (const key of ['iss', 'sub', 'aud']) {
        if (typeof data[key] !== 'string') {
            throw new TypeError(`At path: IdToken.${key}: expected a string`);
        }
    }

    for (const key of ['exp', 'iat']) {
        if (typeof data[key] !== 'number') {
            throw new TypeError(`At path: IdToken.${key}: expected a number`);
        }
    }
}

export const decodeIdToken = (token: string): IdTokenClaims => {
    const { 1: encodedPayload } = token.split('.');

    if (!encodedPayload) {
        throw new LoamError('id_token.invalid_token');
    }

    const json = urlSafeBase64.decode(encodedPayload);
    const idTokenClaims: unknown = JSON.parse(json);
    assertIdTokenClaims(idTokenClaims);

    return idTokenClaims;
};