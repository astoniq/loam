import {HookEvent} from "@/foundations/hooks.js";

export enum Type {
    TriggerHook = 'TriggerHook'
}

export type LogKey = `${Type}.${HookEvent}`