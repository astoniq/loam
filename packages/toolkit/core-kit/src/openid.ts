export enum ReservedScope {
    OpenId = 'openid',
    OfflineAccess = 'offline_access'
}

export type UserClaim =
    | 'name'
    | 'given_name'
    | 'family_name'
    | 'middle_name'
    | 'nickname'
    | 'preferred_username'
    | 'profile'
    | 'picture'
    | 'website'
    | 'email'
    | 'email_verified'
    | 'gender'
    | 'birthdate'
    | 'zoneinfo'
    | 'locale'
    | 'phone_number'
    | 'phone_number_verified'
    | 'address'
    | 'updated_at'
    | 'roles';

export enum UserScope {
    Profile = 'profile',
    Email = 'email',
    Phone = 'phone',
    Address = 'address',
    Roles = 'roles'
}

export const idTokenClaims: Readonly<Record<UserScope, UserClaim[]>> = Object.freeze({
    [UserScope.Profile]: [
        'name',
        'name',
        'family_name',
        'given_name',
        'middle_name',
        'nickname',
        'preferred_username',
        'profile',
        'picture',
        'website',
        'gender',
        'birthdate',
        'zoneinfo',
        'locale',
        'updated_at',
    ],
    [UserScope.Email]: ['email', 'email_verified'],
    [UserScope.Phone]: ['phone_number', 'phone_number_verified'],
    [UserScope.Address]: ['address'],
    [UserScope.Roles]: ['roles']
})

export const userInfoClaims: Readonly<Record<UserScope, UserClaim[]>> = Object.freeze({
    [UserScope.Profile]: [],
    [UserScope.Email]: [],
    [UserScope.Phone]: [],
    [UserScope.Address]: [],
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

