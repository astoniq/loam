import {Prompt, QueryKey} from "../types/index.js";
import {withDefaultScopes} from "../utils/index.js";

const codeChallengeMethod = 'S256';
const responseType = 'code';

export type SignInUriParameters = {
    authorizationEndpoint: string;
    clientId: string;
    redirectUri: string;
    codeChallenge: string;
    state: string;
    scopes?: string[];
    resource?: string;
    prompt?: Prompt | Prompt[]
}

const buildPrompt = (prompt?: Prompt | Prompt[]) => {
    if (Array.isArray(prompt)) {
        return prompt.join(' ')
    }

    return prompt ?? Prompt.Consent;
}

export const generateSignInUri = ({
    authorizationEndpoint,
    prompt,
    redirectUri,
    clientId,
    scopes,
    state,
    resource,
    codeChallenge
}: SignInUriParameters) => {

    const urlSearchParameters = new URLSearchParams({
        [QueryKey.ClientId]: clientId,
        [QueryKey.RedirectUri]: redirectUri,
        [QueryKey.CodeChallenge]: codeChallenge,
        [QueryKey.CodeChallengeMethod]: codeChallengeMethod,
        [QueryKey.State]: state,
        [QueryKey.ResponseType]: responseType,
        [QueryKey.Prompt]: buildPrompt(prompt),
        [QueryKey.Scope]: withDefaultScopes(scopes)
    });

    if (resource) {
        urlSearchParameters.append(QueryKey.Resource, resource)
    }

    return `${authorizationEndpoint}?${urlSearchParameters}`
}