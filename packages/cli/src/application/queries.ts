import {createResourceQueries} from "@/queries/resource.js";
import {CommonQueryMethods} from "slonik";
import {createRoleQueries} from "@/queries/role.js";
import {createLogQueries} from "@/queries/log.js";

export type Queries = ReturnType<typeof createQueries>

export const createQueries = (pool: CommonQueryMethods) => {

    const resource = createResourceQueries(pool)
    const role = createRoleQueries(pool)
    const log = createLogQueries(pool)

    return {
        resource,
        role,
        log,
        pool
    }
}