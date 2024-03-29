import {any, record, z, ZodType} from "zod";
import {System} from "@astoniq/loam-schemas";
import {Guard} from "@/types/index.js";

export enum MigrationStateKey {
    MigrationState = 'migrationState'
}

export type MigrationState = {
    timestamp: number
}

export type MigrationStateType = {
    [MigrationStateKey.MigrationState]: MigrationState
}

export const migrationStateGuard:  {
    [key in MigrationStateKey]: ZodType<MigrationStateType[key]>;
} = {
    [MigrationStateKey.MigrationState]: z.object({
        timestamp: z.number()
    }),
};

export type SystemKey =
    | MigrationStateKey;

export type SystemType =
    | MigrationStateType;

export type SystemGuard = typeof migrationStateGuard

export const systemKeys: SystemKey[] = [
    ...Object.values(MigrationStateKey)
]

export const systemGuards: SystemGuard = {
    ...migrationStateGuard
}

export const systemGuard: Guard<System> = z.object({
    name: z.string().min(1),
    value: record(any())
})
