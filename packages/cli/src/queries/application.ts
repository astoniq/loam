import {CommonQueryMethods} from "slonik";
import {buildFindEntityByIdWithPool} from "@/database/index.js";
import {applicationEntity} from "@/entities/index.js";
import {applicationGuard} from "@astoniq/loam-schemas";


export const createApplicationQueries = (pool: CommonQueryMethods) => {

    const findApplicationById = buildFindEntityByIdWithPool(pool)(applicationEntity, applicationGuard)

    return {
        findApplicationById
    }
}