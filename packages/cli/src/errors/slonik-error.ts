import {SlonikError} from "slonik";
import {OmitAutoSetFields} from "@/utils/sql.js";
import {Entity, EntityLike, UpdateWhereData} from "@/types/index.js";

export class DeletionError extends SlonikError {
    public constructor(
        public readonly table?: string,
        public readonly id?: string
    ) {
        super('Resourse not found');
    }
}

export class UpdateError<
    T extends EntityLike<T>,
    SetKey extends Partial<EntityLike<T>>,
    WhereKey extends Partial<EntityLike<T>>,
> extends SlonikError {
    public constructor(
        public readonly entity: Entity<T>,
        public readonly detail: Partial<UpdateWhereData<SetKey, WhereKey>>
    ) {
        super('Resource not found');
    }
}

export class InsertionError<
    T extends EntityLike<T>,
    CreateEntity extends Partial<EntityLike<T>>
> extends SlonikError {
    public constructor(
        public readonly entity: Entity<T>,
        public readonly detail?: OmitAutoSetFields<CreateEntity>
    ) {
        super('Create Error');
    }
}