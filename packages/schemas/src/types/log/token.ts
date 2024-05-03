export enum Type {
    ExchangeTokenBy = 'ExchangeTokenBy',
    RevokeToken = 'RevokeToken'
}

export enum TokenType {
    AccessToken = 'AccessToken',
    RefreshToken = 'RefreshToken',
    IdToken = 'IdToken',
    AuthorizationCode = 'AuthorizationCode',
    DeviceCode = 'DeviceCode'
}

export enum ExchangeByType {
    Unknown = 'Unknown',
    AuthorizationCode = 'AuthorizationCode',
    RefreshToken = 'RefreshToken',
    ClientCredentials = 'ClientCredentials'
}

export type LogKey = `${Type.ExchangeTokenBy}.${ExchangeByType} | ${Type.RevokeToken}`