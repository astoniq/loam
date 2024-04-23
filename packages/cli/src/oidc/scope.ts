import {idTokenClaims, UserClaim, userInfoClaims, UserScope} from "@astoniq/loam-core-kit";
import {User} from "@astoniq/loam-schemas";
import {Libraries} from "@/application/libraries.js";

const claimToUserKey: Readonly<
    Record<
        Exclude<
            UserClaim,
            | 'email_verified'
            | 'phone_number_verified'
            | 'roles'
        >,
        keyof User
    >
> = Object.freeze({
    name: 'name',
    picture: 'avatar',
    username: 'username',
    email: 'primaryEmail',
    phone_number: 'primaryPhone'
});

export const getUserClaimsData = async (
    user: User,
    claims: UserClaim[],
    userLibrary: Libraries['user']
) => {
 return Promise.all(
     claims.map(async (claim) => {
         switch (claim) {
             case "email_verified":
                 return [claim, Boolean(user.primaryEmail)]
             case "phone_number_verified":
                 return [claim, Boolean(user.primaryPhone)]
             case "roles":
                 const roles = await userLibrary.findUserRoles(user.id)
                 return [claim, roles.map(({name}) => name)]
             default: {
                 return [claim, user[claimToUserKey[claim]]];
             }
         }
     })
 )
}

export const getAcceptedUserClaims = (
    use: 'id_token' | 'userinfo',
    scope: string,
    rejected: string[]
): UserClaim[] => {
    const scopes = scope.split(' ');
    const isUserInfo = use === 'userinfo'
    const allScopes = Object.values(UserScope)
    return scopes
        .flatMap(raw => {
            const scope = allScopes.find(value => value === raw)
            if (!scope) {
                return []
            }

            if (isUserInfo) {
                return [...idTokenClaims[scope], ...userInfoClaims[scope]]
            }

            return idTokenClaims[scope]
        })
        .filter(claim => !rejected.includes(claim))
}