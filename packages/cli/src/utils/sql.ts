import type {IdentifierSqlToken, QueryResult, SqlToken} from "slonik";
import {sql} from "slonik";
import {Falsy, notFalsy} from "@astoniq/essentials";
import {Entity, EntityKeys, EntityLike, EntityValue, EntityValuePrimitive, Table} from "@/types/index.js";

export const autoSetFields = Object.freeze(['createdAt', 'updatedAt'] as const)

export type OmitAutoSetFields<T> = Omit<T, (typeof autoSetFields)[number]>

type ExcludeAutoSetFields<T> = Exclude<T, (typeof autoSetFields)[number]>

export const excludeAutoSetFields =
    <T extends EntityLike<T>,
        Keys extends EntityKeys<T>
    >({fieldKeys}: Entity<T>) =>
        Object.freeze(
            fieldKeys.filter(
                (field: PropertyKey): field is ExcludeAutoSetFields<Keys> => !(field in autoSetFields)))


export const convertToPrimitiveOrSql = (
    key: string,
    value: EntityValue
): NonNullable<EntityValuePrimitive> | SqlToken | null => {
    if (value === null) {
        return null
    }

    if (typeof value === 'object') {
        return JSON.stringify(value)
    }

    if (
        (['_at', 'At'].some((value) => key.endsWith(value)) || key === 'date') &&
        typeof value === 'number'
    ) {
        return sql.fragment`to_timestamp(${value}::double precision / 1000)`;
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
        return value;
    }

    if (typeof value === 'string') {
        if (value === '') {
            return null;
        }

        return value;
    }

    throw new Error(`Cannot convert ${key} to primitive`);
}


type FiledIdentifiers<T> = {
    [key in keyof T]: IdentifierSqlToken
}

export const convertToIdentifiers = <T extends EntityLike<T>>(
    {table, fields}: Table<T>,
    withPrefix = false
) => {
    const fieldsIdentifiers = Object.entries<string>(fields).map<[keyof T, IdentifierSqlToken]>(
        ([key, value]) => [key as keyof T, sql.identifier(withPrefix ? [table, value] : [value])]
    )

    return {
        table: sql.identifier([table]),
        fields: Object.fromEntries(fieldsIdentifiers) as FiledIdentifiers<T>
    }
}

export const conditionalSql = <T>(value: T, buildSql: (value: Exclude<T, Falsy>) => SqlToken) =>
    notFalsy(value) ? buildSql(value) : sql.fragment``;

export const conditionalArraySql = <T>(value: T[],
                                       buildSql: (value: Exclude<T[], Falsy>) => SqlToken) =>
    (value.length > 0 ? buildSql(value) : sql.fragment``)

export const convertToTimestamp = (time = new Date()) =>
    sql.fragment`to_timestamp(${time.valueOf() / 1000})`;

export const manyRows = async <T>(query: Promise<QueryResult<T>>): Promise<readonly T[]> => {
    const {rows} = await query

    return rows
}