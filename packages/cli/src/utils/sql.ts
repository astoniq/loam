import {Table} from "@astoniq/loam-shared";
import type {IdentifierSqlToken} from "slonik";
import {sql} from "slonik";

export const autoSetFields = Object.freeze(['createdAt', 'updatedAt'] as const)

export type OmitAutoSetFields<T> = Omit<T, (typeof autoSetFields)[number]>

type FiledIdentifiers<Key extends string> = {
    [key in Key]: IdentifierSqlToken
}

export const convertToIdentifiers = <Key extends string>(
    {table, fields}: Table<Key>,
    withPrefix = false
) => {
    const fieldsIdentifiers = Object.entries<string>(fields).map<[Key, IdentifierSqlToken]>(
        ([key, value]) => [key as Key, sql.identifier(withPrefix ? [table, value] : [value])]
    )

    return {
        table: sql.identifier([table]),
        fields: Object.fromEntries(fieldsIdentifiers) as FiledIdentifiers<Key>
    }
}