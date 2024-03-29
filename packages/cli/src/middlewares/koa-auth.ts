import type {IRouterParamContext} from 'koa-router';
import type {IncomingHttpHeaders} from 'node:http';
import assertThat from "@/utils/assert-that.js";
import {RequestError} from "@/errors/index.js";

export type KoaAuth = {
    type: 'user' | 'app';
    id: string
}

export type WithAuthContext<Context extends IRouterParamContext = IRouterParamContext> = Context & {
    auth: KoaAuth
}

const bearerTokenIdentifier = 'Bearer'

export const extractBearerTokenFromHeaders = ({authorization}: IncomingHttpHeaders) => {
    assertThat(authorization,
        new RequestError({code: 'auth.authorization_header_missing', status: 401}));

    assertThat(
        authorization.startsWith(bearerTokenIdentifier),
        new RequestError({code: 'auth.authorization_token_type_not_supported', status: 401}, {
            supportedTypes: [bearerTokenIdentifier]
        })
    )

    return authorization.slice(bearerTokenIdentifier.length + 1);
}