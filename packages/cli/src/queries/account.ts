import {convertToIdentifiers} from "@/utils/sql.js";
import {accountEntity} from "@/entities/index.js";
import {CommonQueryMethods} from "slonik";

const {table, fields} = convertToIdentifiers(accountEntity);

export const createAccountQueries = (pool: CommonQueryMethods) => {

}