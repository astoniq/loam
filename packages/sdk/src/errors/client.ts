const loamClientErrorCodes = Object.freeze({
    'sign_in_session.invalid': 'Invalid sign-in session',
    'sign_in_session.not_fount': 'Sign-in session not found',
    'not_authenticated': 'Not authenticated',
    'fetch_user_info_failed': 'Unable to fetch user info',
    'user_cancelled': 'The user cancelled the action'
})

export type LoamClientErrorCode = keyof typeof loamClientErrorCodes;

export class LoamClientError extends Error {
    name = 'LoamClientError';
    code: LoamClientErrorCode;
    data: unknown;

    constructor(code: LoamClientErrorCode, data?: unknown) {
        super(loamClientErrorCodes[code]);
        this.code = code;
        this.data = data;
    }
}