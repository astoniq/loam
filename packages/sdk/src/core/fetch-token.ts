import {KeysToCamelCase} from "@astoniq/essentials";
import {Requester} from "../types/index.js";
import {ContentType, QueryKey, TokenGrantType} from "../types/index.js";
import camelcaseKeys from 'camelcase-keys';

export type FetchTokenByAuthorizationCodeParameters = {
    clientId: string
    tokenEndpoint: string;
    redirectUri: string;
    codeVerifier: string;
    code: string;
    resource?: string;
}

export type FetchTokenByRefreshTokenParameters = {
    clientId: string;
    tokenEndpoint: string;
    refreshToken: string;
    resource?: string;
    scopes?: string[]
}

type SnakeCaseCodeTokenResponse = {
    access_token: string;
    refresh_token?: string;
    id_token: string;
    scope: string;
    expires_in: number;
}

export type CodeTokenResponse = KeysToCamelCase<SnakeCaseCodeTokenResponse>;

type SnakeCaseRefreshTokenResponse = {
    access_token: string;
    refresh_token?: string;
    id_token?: string;
    scope: string;
    expires_in: number;
}

export type RefreshTokenResponse = KeysToCamelCase<SnakeCaseRefreshTokenResponse>;

export const fetchTokenByAuthorizationCode = async (
    {
        clientId,
        tokenEndpoint,
        resource,
        redirectUri,
        codeVerifier,
        code
    }: FetchTokenByAuthorizationCodeParameters,
    requester: Requester
): Promise<CodeTokenResponse> => {

    const parameters = new URLSearchParams();

    parameters.append(QueryKey.ClientId, clientId);
    parameters.append(QueryKey.Code, code);
    parameters.append(QueryKey.CodeVerifier, codeVerifier);
    parameters.append(QueryKey.RedirectUri, redirectUri);
    parameters.append(QueryKey.GrantType, TokenGrantType.AuthorizationCode)

    if (resource) {
        parameters.append(QueryKey.Resource, resource)
    }

    const snakeCaseCodeTokenResponse = await requester<SnakeCaseCodeTokenResponse>(tokenEndpoint, {
        method: 'POST',
        headers: ContentType.formUrlEncoded,
        body: parameters
    });

    return camelcaseKeys(snakeCaseCodeTokenResponse)
}

export const fetchTokenByRefreshToken = async (
    {
        clientId,
        tokenEndpoint,
        resource,
        refreshToken,
        scopes
    }: FetchTokenByRefreshTokenParameters,
    requester: Requester
): Promise<RefreshTokenResponse> => {

    const parameters = new URLSearchParams();

    parameters.append(QueryKey.ClientId, clientId)
    parameters.append(QueryKey.RefreshToken, refreshToken);
    parameters.append(QueryKey.GrantType, TokenGrantType.RefreshToken);

    if (resource) {
        parameters.append(QueryKey.Resource, resource)
    }

    if (scopes?.length) {
        parameters.append(QueryKey.Scope, scopes.join(' '))
    }

    const snakeCaseRefreshTokenResponse = await requester<SnakeCaseRefreshTokenResponse>(
        tokenEndpoint,
        {
            method: 'POST',
            headers: ContentType.formUrlEncoded,
            body: parameters
        }
    )

    return camelcaseKeys(snakeCaseRefreshTokenResponse)
}