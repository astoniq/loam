import {type SchemaLike} from '@astoniq/loam-shared'
import type {ZodObject, ZodType, ZodOptional, ZodTypeAny} from 'zod';

export type {SchemaLike, SchemaValue, SchemaValuePrimitive} from '@astoniq/loam-shared'

type ParseOptional<K> = undefined extends K
    ? ZodOptional<ZodType<Exclude<K, undefined>>>
    : ZodType<K>

export type Guard<T extends SchemaLike<string>> = ZodObject<{
    [key in keyof T] -?: ParseOptional<T[key]>
},
    'strip',
    ZodTypeAny,
    T,
    T
>