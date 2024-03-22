import type {UpdateWhereData} from "@astoniq/loam-shared";
import type {SchemaLike, GeneratedSchema} from "@astoniq/loam-schemas";
import {SlonikError} from "slonik";
import {OmitAutoSetFields} from "@/utils/sql";

export class DeletionError extends SlonikError {
    public constructor(
        public readonly table?: string,
        public readonly id?: string
    ) {
        super('Resourse not found');
    }
}

export class UpdateError<
    Key extends string,
    CreateSchema extends Partial<SchemaLike<Key>>,
    Schema extends SchemaLike<Key>,
    SetKey extends Key,
    WhereKey extends Key,
> extends SlonikError {
    public constructor(
        public readonly schema: GeneratedSchema<Key, CreateSchema, Schema>,
        public readonly detail: Partial<UpdateWhereData<SetKey, WhereKey>>
    ) {
        super('Resource not found.');
    }
}

export class InsertionError<
    Key extends string,
    CreateSchema extends Partial<SchemaLike<Key>>,
    Schema extends SchemaLike<Key>,
> extends SlonikError {
    public constructor(
        public readonly schema: GeneratedSchema<Key, CreateSchema, Schema>,
        public readonly detail?: OmitAutoSetFields<CreateSchema>
    ) {
        super('Create Error.');
    }
}