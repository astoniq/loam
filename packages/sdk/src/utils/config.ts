import {ClientConfig, Prompt, SignInSessionItem} from "@/types/index.js";
import {withDefaultScopes} from "@/utils/scopes.js";
import {isArbitraryObject} from "@/utils/arbitrary-object.js";


export const normalizeConfig = (config: ClientConfig): ClientConfig => {
    const {prompt = Prompt.Consent, scopes = [], resource, ...rest} = config

    return {
        ...rest,
        prompt,
        scopes: withDefaultScopes(scopes).split(' '),
        resource
    }
}

export const isSignInSessionItem = (data: unknown): data is SignInSessionItem => {
    if (!isArbitraryObject(data)) {
        return false
    }

    return ['redirectUri', 'codeVerifier', 'state']
        .every(key => typeof data[key] === 'string')
}