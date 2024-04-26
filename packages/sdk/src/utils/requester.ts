

export const discoveryPath = '/oidc/.well-known/openid-configuration'

export const getDiscoveryEndpoint = (endpoint: string): string =>
    new URL(discoveryPath,endpoint).toString()