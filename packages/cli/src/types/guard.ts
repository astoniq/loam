import type {ZodObject, ZodType, ZodOptional, ZodTypeAny} from 'zod';
import {EntityLike} from "@/types/entity";

type ParseOptional<K> = undefined extends K
    ? ZodOptional<ZodType<Exclude<K, undefined>>>
    : ZodType<K>

export type Guard<T extends EntityLike<T>> = ZodObject<{
    [key in keyof T] -?: ParseOptional<T[key]>
},
    'strip',
    ZodTypeAny,
    T,
    T
>