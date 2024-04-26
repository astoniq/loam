import {
    ClientAdapter,
    ClientCacheKey,
    ClientConfig,
    ClientStorageKey,
    InferStorageKey, Prompt,
    SignInSessionItem
} from "@/types/index.js";
import {
    AccessTokenClaims, decodeAccessToken, decodeIdToken, IdTokenClaims,
    isSignInSessionItem,
    normalizeConfig,
    once,
    verifyAndParseCodeFromCallbackUri
} from "@/utils/index.js";
import {conditional, Nullable, trySafe} from "@astoniq/essentials";
import {
    fetchOidcConfig,
    fetchTokenByAuthorizationCode,
    fetchTokenByRefreshToken, fetchUserInfo, generateSignInUri, generateSignOutUri,
    OidcConfigResponse, revoke, UserInfoResponse,
} from "@/core/index.js";
import {getDiscoveryEndpoint} from "@/utils/requester.js";
import {LoamClientError} from "@/errors/index.js";
import {generateCodeChallenge, generateCodeVerifier, generateState} from "@/client/generators.js";


export type SignInOptions = {
    redirectUri: string | URL;
    postRedirectUri?: string | URL;
    prompt?: Prompt | Prompt[]
}

export class LoamClient {
    readonly config: ClientConfig;
    readonly adapter: ClientAdapter;

    readonly getOidcConfig: () => Promise<OidcConfigResponse> = once(this.getOidcConfigWithCache);

    constructor(config: ClientConfig, adapter: ClientAdapter) {
        this.config = normalizeConfig(config);
        this.adapter = adapter;
    }

    private async setAccessToken(value: Nullable<string>): Promise<void> {
        return this.setStorageItem(ClientStorageKey.AccessToken, value)
    }

    private async setRefreshToken(value: Nullable<string>) {
        return this.setStorageItem(ClientStorageKey.RefreshToken, value)
    }

    private async setIdToken(value: Nullable<string>) {
        return this.setStorageItem(ClientStorageKey.IdToken, value)
    }

    async getRefreshToken() {
        return this.adapter.storage.getItem(ClientStorageKey.RefreshToken)
    }

    async getIdToken() {
        return this.adapter.storage.getItem(ClientStorageKey.IdToken)
    }

    async getAccessToken(): Promise<string> {

        const isAuthenticated = await this.isAuthenticated()

        if (!(isAuthenticated)) {
            throw new LoamClientError('not_authenticated')
        }

        const accessToken = await this.adapter.storage
            .getItem(ClientStorageKey.AccessToken);

        if (accessToken) {
            return accessToken
        }

        return this.getAccessTokenByRefreshToken()
    }

    async isAuthenticated() {
        return Boolean(await this.getIdToken())
    }

    async clearAllTokens(): Promise<void> {
        await Promise.all([this.setRefreshToken(null), this.setIdToken(null), this.setAccessToken(null)])
    }

    protected async getSignInSession(): Promise<Nullable<SignInSessionItem>> {
        const jsonItem = await this.adapter.storage.getItem(ClientStorageKey.SignInSession);

        if (!jsonItem) {
            return null
        }

        const item: unknown = JSON.parse(jsonItem);

        if (!isSignInSessionItem(item)) {
            throw new LoamClientError('sign_in_session.invalid')
        }

        return item
    }

    protected async setSignInSession(value: Nullable<SignInSessionItem>) {
        return this.setStorageItem(ClientStorageKey.SignInSession, value && JSON.stringify(value))
    }

    async handleSignInCallback(callbackUri: string) {
        const signInSession = await this.getSignInSession()

        if (!signInSession) {
            throw new LoamClientError('sign_in_session.not_fount')
        }

        const {redirectUri, postRedirectUri, state, codeVerifier} = signInSession;
        const code = verifyAndParseCodeFromCallbackUri(callbackUri, redirectUri, state);

        const {clientId} = this.config

        const {tokenEndpoint} = await this.getOidcConfig()

        const {idToken, refreshToken, accessToken} = await fetchTokenByAuthorizationCode(
            {
                clientId,
                tokenEndpoint,
                redirectUri,
                codeVerifier,
                code
            },
            this.adapter.requester
        )

        await this.setRefreshToken(refreshToken ?? null);
        await this.setIdToken(idToken);
        await this.setAccessToken(accessToken);
        await this.setSignInSession(null);

        if (postRedirectUri) {
            await this.adapter.navigate(postRedirectUri, {for: 'post-sign-in'})
        }
    }

    async getAccessTokenByRefreshToken(): Promise<string> {
        const currentRefreshToken = await this.getRefreshToken();

        if (!currentRefreshToken) {
            throw new LoamClientError("not_authenticated");
        }

        const {clientId, resource} = this.config;

        const {tokenEndpoint} = await this.getOidcConfig();

        const {accessToken, refreshToken, idToken} = await fetchTokenByRefreshToken(
            {
                clientId,
                tokenEndpoint,
                refreshToken: currentRefreshToken,
                resource
            },
            this.adapter.requester)

        if (accessToken) {
            await this.setAccessToken(accessToken)
        }

        if (refreshToken) {
            await this.setRefreshToken(refreshToken)
        }

        if (idToken) {
            await this.setIdToken(idToken)
        }

        return accessToken

    }

    private async setStorageItem(key: InferStorageKey<typeof this.adapter.storage>, value: Nullable<string>) {
        if (!value) {
            await this.adapter.storage.removeItem(key)
            return;
        }
        await this.adapter.storage.setItem(key, value)
    }

    private async getCachedObject<T>(key: ClientCacheKey): Promise<T | undefined> {
        const cached = await trySafe(async () => {
            const data = await this.adapter.cache?.getItem(key)

            return conditional(data && (JSON.parse(data) as unknown))
        })

        if (cached) {
            return cached as T
        }

        return undefined
    }

    private async getWithCache<T>(key: ClientCacheKey, getter: () => Promise<T>): Promise<T> {
        const cached = await this.getCachedObject<T>(key)

        if (cached) {
            return cached
        }

        const result = await getter()

        if (this.adapter.cache) {
            await this.adapter.cache.setItem(key, JSON.stringify(result))
        }

        return result;
    }

    private async getOidcConfigWithCache(): Promise<OidcConfigResponse> {
        return this.getWithCache(ClientCacheKey.OpenIdConfig, async () => {
            return fetchOidcConfig(
                getDiscoveryEndpoint(this.config.endpoint),
                this.adapter.requester
            )
        })
    }

    async signOut(postLogoutRedirectUri?: string): Promise<void> {
        const {clientId} = this.config
        const {endSessionEndpoint, revocationEndpoint} = await this.getOidcConfig()
        const refreshToken = await this.getRefreshToken()

        if (refreshToken) {
            try {
                await revoke(revocationEndpoint, clientId, refreshToken, this.adapter.requester)
            } catch {

            }
        }

        const url = generateSignOutUri({
            endSessionEndpoint,
            postLogoutRedirectUri,
            clientId
        })

        await this.clearAllTokens()
        await this.adapter.navigate(url, {redirectUri: postLogoutRedirectUri, for: 'sign-out'})
    }

    async isSignInRedirected(url: string): Promise<boolean> {
        const signInSession = await this.getSignInSession();

        if (!signInSession) {
            return false;
        }
        const {redirectUri} = signInSession;
        const {origin, pathname} = new URL(url);

        return `${origin}${pathname}` === redirectUri;
    }

    async signIn(options: SignInOptions): Promise<void> {

        const redirectUri = options.redirectUri.toString()
        const postRedirectUri = options.postRedirectUri?.toString();

        const {clientId, scopes, resource, prompt } = this.config
        const {authorizationEndpoint} = await this.getOidcConfig()
        const [codeVerifier, state] = await Promise.all([
            generateCodeVerifier(),
            generateState()
        ])

        const codeChallenge = await generateCodeChallenge(codeVerifier);

        const signInUri = generateSignInUri({
            authorizationEndpoint,
            clientId,
            redirectUri,
            codeChallenge,
            state,
            scopes,
            resource,
            prompt: prompt ?? options.prompt
        })

        await Promise.all([
            this.setSignInSession({redirectUri, postRedirectUri, codeVerifier, state}),
            this.clearAllTokens()
        ])

        await this.adapter.navigate(signInUri, {redirectUri, for: 'sign-in'})

    }


    async fetchUserInfo(): Promise<UserInfoResponse> {
        const {userinfoEndpoint} = await this.getOidcConfig()
        const accessToken = await this.getAccessToken()

        if (!accessToken) {
            throw new LoamClientError('fetch_user_info_failed')
        }

        return fetchUserInfo(userinfoEndpoint, accessToken, this.adapter.requester)
    }

    async getAccessTokenClaims(): Promise<AccessTokenClaims> {
        const accessToken = await this.getAccessToken()
        return decodeAccessToken(accessToken)
    }

    async getIdTokenClaims(): Promise<IdTokenClaims> {
        const idToken = await this.getIdToken();

        if (!idToken) {
            throw new LoamClientError('not_authenticated');
        }

        return decodeIdToken(idToken);
    }
}