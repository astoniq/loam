import {QueryKey} from "../types/index.js";

export type SignOutUriParameters = {
    endSessionEndpoint: string;
    clientId: string;
    postLogoutRedirectUri?: string;
}

export const generateSignOutUri = (
    {
        endSessionEndpoint,
        postLogoutRedirectUri,
        clientId
    }: SignOutUriParameters) => {
    const urlSearchParameters = new URLSearchParams({
        [QueryKey.ClientId]: clientId
    });

    if (postLogoutRedirectUri) {
        urlSearchParameters.append(QueryKey.PostLogoutRedirectUri, postLogoutRedirectUri)
    }

    return `${endSessionEndpoint}?${urlSearchParameters}`
}