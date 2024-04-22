import {convertToIdentifiers} from "@/utils/sql.js";
import {userEntity} from "@/entities/index.js";
import {CommonQueryMethods} from "slonik";

const {table, fields} = convertToIdentifiers(userEntity);

export const createUserQueries = (pool: CommonQueryMethods) => {

    return {}
}