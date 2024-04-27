import {ApplicationContext} from "@/application/types.js";
import {UserIdentity} from "@/routes/interaction/types.js";


export async function findUserByIdentifier(
    {queries}: ApplicationContext,
    identity: UserIdentity
) {
    const {
        findUserByEmail,
    } = queries.user

    if ('email' in identity) {
        return findUserByEmail(identity.email)
    }

    return null
}