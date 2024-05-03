import {Requester} from "../types/index.js";
import {ContentType, QueryKey} from "../types/index.js";


export const revoke = async (
    revocationEndpoint: string,
    clientId: string,
    token: string,
    requester: Requester
) => {
    return requester<void>(revocationEndpoint, {
        method: 'POST',
        headers: ContentType.formUrlEncoded,
        body: new URLSearchParams({
            [QueryKey.ClientId]: clientId,
            [QueryKey.Token]: token
        })
    })
}