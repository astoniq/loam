export enum ReservedScope {
    OpenId = 'openid',
    OfflineAccess = 'offline_access'
}

export type UserClaim =
    | 'name'
    | 'picture'
    | 'username'
    | 'email'
    | 'email_verified'
    | 'phone_number'
    | 'phone_number_verified'
    | 'roles';

export enum UserScope {
    Profile = 'profile',
    Email = 'email',
    Phone = 'phone',
    Roles = 'roles'
}

export const idTokenClaims: Readonly<Record<UserScope, UserClaim[]>> = Object.freeze({
    [UserScope.Profile]: ['name', 'picture', 'username'],
    [UserScope.Email]: ['email', 'email_verified'],
    [UserScope.Phone]: ['phone_number', 'phone_number_verified'],
    [UserScope.Roles]: ['roles']
})

export const userInfoClaims: Readonly<Record<UserScope, UserClaim[]>> = Object.freeze({
    [UserScope.Profile]: [],
    [UserScope.Email]: [],
    [UserScope.Phone]: [],
    [UserScope.Roles]: []
})

export const userClaims: Readonly<Record<UserScope, UserClaim[]>> = Object.freeze(
    Object.fromEntries(
        Object.values(UserScope).map((current) => [
            current,
            [...idTokenClaims[current], ...userInfoClaims[current]]
        ])
    ) as Record<UserScope, UserClaim[]>
)

