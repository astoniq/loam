import {CommonQueryMethods} from "slonik";
import {Entity, EntityLike, UpdateWhereData} from "@/types";

type BuildUpdateWhere = {
    <T extends EntityLike<T>>
    (entity: Entity<T>, returning: true): (data: UpdateWhereData<T, T>) => Promise<T>;

}

export const buildUpdateWhereWithPool =
    (pool: CommonQueryMethods): BuildUpdateWhere => <
    T extends EntityLike<T>>(entity: Entity<T>) => {
    
    }