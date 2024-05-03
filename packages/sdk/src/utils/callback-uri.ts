import {LoamError, LoamOidcError} from "../errors/index.js";
import {conditional} from "@astoniq/essentials";
import {QueryKey} from "../types/index.js";


export const parseUriParameters = (uri: string) => {
    const [, queryString = ''] = uri.split('?')

    return new URLSearchParams(queryString)
}

export const verifyAndParseCodeFromCallbackUri = (
    callbackUri: string,
    redirectUri: string,
    state: string
) => {
    if (!callbackUri.startsWith(redirectUri)) {
        throw new LoamError(
            'callback_uri_verification.redirect_uri_mismatched')
    }

    const uriParameters = parseUriParameters(callbackUri);

    const error = conditional(uriParameters.get(QueryKey.Error))
    const errorDescription = conditional(uriParameters.get(QueryKey.ErrorDescription))

    if (error) {
        throw new LoamError(
            'callback_uri_verification.error_found',
            new LoamOidcError(error, errorDescription)
        )
    }

    const stateFromCallbackUri = uriParameters.get(QueryKey.State);

    if (!stateFromCallbackUri) {
        throw new LoamError(
            'callback_uri_verification.missing_state')
    }

    if (stateFromCallbackUri !== state) {
        throw new LoamError(
            'callback_uri_verification.state_mismatched')
    }

    const code = uriParameters.get(QueryKey.Code)

    if (!code) {
        throw new LoamError(
            'callback_uri_verification.missing_code')
    }

    return code;
}