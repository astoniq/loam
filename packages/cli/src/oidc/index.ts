import {OidcConfig} from "@/config/index.js";
import {Queries} from "@/application/queries.js";
import Provider from "oidc-provider";
import postgresAdapter from "@/oidc/adapter.js";
import koaAuditLog from "@/middlewares/koa-audit-log.js";


export default function initOidc(config: OidcConfig,
                                 queries: Queries) {


    const {issuer} = config

    const oidc = new Provider(issuer.href, {
        adapter: postgresAdapter.bind(null, config, queries)
    })

    oidc.use(koaAuditLog(queries))

    return oidc
}