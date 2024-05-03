import {IdTokenClaims} from "../utils/index.js";
import {Requester} from "../types/index.js";

export type UserInfoResponse = IdTokenClaims;

export const fetchUserInfo = async (
    userInfoEndpoint: string,
    accessToken: string,
    requester: Requester
): Promise<UserInfoResponse> => {
    return requester<UserInfoResponse>(userInfoEndpoint, {
        headers: { Authorization: `Bearer ${accessToken}` },
    })
}