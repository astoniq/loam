export interface Config {
    isProduction: boolean,
    isUnitTest: boolean,
    httpsCert: string,
    httpsKey: string,
    isHttpsEnabled: boolean,
    databaseUrl: string,
    databasePoolSize: number,
    redisUrl: string,
    port: number,
    endpoint: string
}