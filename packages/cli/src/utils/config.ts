import {assertEnv, getEnv, tryThat, yes} from "@astoniq/essentials";

export const loadConfig = () => {

    const isProduction = getEnv('NODE_ENV') === 'production'
    const isUnitTest = getEnv('NODE_ENV') === 'test';

    const httpsCert = getEnv("HTTPS_CERT_PATH");
    const httpsKey = getEnv("HTTPS_KEY_PATH");

    const isHttpsEnabled = Boolean(httpsCert && httpsKey);

    const databaseUrl = tryThat(() => assertEnv('DB_URL'), () => {
        throw new Error(`No Postgres DSN found in env key 'DB_URL' variables'`);
    });

    const databasePoolSize = Number(
        getEnv('DATABASE_POOL_SIZE', '20'));

    const isCaseSensitiveUsername = yes(
        getEnv('CASE_SENSITIVE_USERNAME', 'true'));

    const redisUrl = getEnv('REDIS_URL');

    const port = Number(getEnv('PORT', "5000"));

    const endpoint = getEnv('ENDPOINT', 'localhost');

    return {
        isProduction,
        isUnitTest,
        httpsCert,
        httpsKey,
        isHttpsEnabled,
        databaseUrl,
        databasePoolSize,
        redisUrl,
        port,
        endpoint,
        isCaseSensitiveUsername
    }
}
