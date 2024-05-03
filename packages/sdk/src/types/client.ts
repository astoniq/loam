import {Prompt} from "./query.js";
import {Requester} from "./requester.js";
import {Nullable} from "@astoniq/essentials";

export type ClientConfig = {
    endpoint: string;
    clientId: string;
    clientSecret?: string;
    scopes?: string[]
    resource?: string;
    prompt?: Prompt | Prompt[]
}

export enum ClientStorageKey {
    IdToken = 'idToken',
    RefreshToken = 'refreshToken',
    AccessToken = 'accessToken',
    SignInSession = 'signInSession'
}

export enum ClientCacheKey {
    OpenIdConfig = 'openIdConfig',
    Jwks = 'jwks'
}

export type ClientNavigateParams = {
    redirectUri?: string;
    for: 'sign-in' | 'sign-out' | 'post-sign-in'
}

export type ClientNavigate = (
    url: string,
    parameters: ClientNavigateParams
) => void | Promise<void>

export type ClientStorage<Keys extends string> = {
    getItem(key: Keys): Promise<Nullable<string>>;
    setItem(key: Keys, value: string): Promise<void>;
    removeItem(key: Keys): Promise<void>;
}

export type InferStorageKey<S> = S extends ClientStorage<infer Key> ? Key : never;

export type ClientAdapter = {
    requester: Requester;
    storage: ClientStorage<ClientStorageKey>;
    navigate: ClientNavigate;
    cache?: ClientStorage<ClientCacheKey>;
}

export type SignInSessionItem = {
    redirectUri: string;
    postRedirectUri?: string;
    codeVerifier: string;
    state: string;
}