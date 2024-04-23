import {createResourceQueries} from "@/queries/resource.js";
import {CommonQueryMethods} from "slonik";
import {createRoleQueries} from "@/queries/role.js";
import {createLogQueries} from "@/queries/log.js";
import {createUserQueries} from "@/queries/user.js";
import {createOidcModelInstanceQueries} from "@/queries/oidc-model-instance.js";
import {createApplicationQueries} from "@/queries/application.js";
import {createUserRoleQueries} from "@/queries/user-role.js";
import {createScopeQueries} from "@/queries/scope.js";

export type Queries = ReturnType<typeof createQueries>

export const createQueries = (pool: CommonQueryMethods) => {

    const resource = createResourceQueries(pool)
    const role = createRoleQueries(pool)
    const log = createLogQueries(pool)
    const user = createUserQueries(pool)
    const oidcModelInstance = createOidcModelInstanceQueries(pool)
    const application = createApplicationQueries(pool)
    const userRole = createUserRoleQueries(pool)
    const scope = createScopeQueries(pool)

    return {
        oidcModelInstance,
        scope,
        application,
        userRole,
        resource,
        user,
        role,
        log,
        pool
    }
}