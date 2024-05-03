import {isArbitraryObject} from "../utils/index.js";


const loamErrorCodes = Object.freeze({
    'id_token.invalid_iat': 'Invalid issued at time in the ID token',
    'id_token.invalid_token': 'Invalid ID token',
    'callback_uri_verification.redirect_uri_mismatched':
        'The callback URI mismatches the redirect URI.',
    'callback_uri_verification.error_found': 'Error found in the callback URI',
    'callback_uri_verification.missing_state': 'Missing state in the callback URI',
    'callback_uri_verification.state_mismatched': 'State mismatched in the callback URI',
    'callback_uri_verification.missing_code': 'Missing code in the callback URI',
    'crypto_subtle_unavailable': 'Crypto.subtle is unavailable in insecure contexts (non-HTTPS).',
    'unexpected_response_error': 'Unexpected response error from the server.',
})

export type LoamErrorCode = keyof typeof loamErrorCodes;

export class LoamError extends Error {
    name = 'LoamError';
    code: LoamErrorCode
    data: unknown

    constructor(code: LoamErrorCode, data?: unknown) {
        super(loamErrorCodes[code]);
        this.code = code;
        this.data = data
    }
}

export type LoamRequestErrorPayload = {
    code: string;
    message: string;
}

export const isLoamRequestError = (data: unknown): data is LoamRequestErrorPayload => {
    if (!isArbitraryObject(data)) {
        return false
    }

    return typeof data.code === 'string' && typeof data.message === 'string'
}

export class LoamRequestError extends Error {
    name = 'LoadRequestError'
    code: string;

    constructor(code: string, message: string) {
        super(message);
        this.code = code
    }
}

export class LoamOidcError {
    constructor(
        public error: string,
        public errorDescription?: string
    ) {
    }
}