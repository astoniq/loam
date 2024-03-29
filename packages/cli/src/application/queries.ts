import {createResourceQueries} from "@/queries/resource.js";
import {CommonQueryMethods} from "slonik";
import {createRoleQueries} from "@/queries/role.js";

export type Queries = ReturnType<typeof createQueries>

export const createQueries = (pool: CommonQueryMethods) => {

    const resource = createResourceQueries(pool)
    const role = createRoleQueries(pool)

    return {
        resource,
        role,
        pool
    }
}