import {IRouterParamContext} from "koa-router";
import {Context} from "koa";
import {LogContextPayload, LogKey, LogResult} from "@astoniq/loam-schemas";

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

const filterSensitiveData = (data: Record<string, unknown>): Record<string, unknown> => {
    return Object.fromEntries(
        Object.entries(data).map(([key, value]) => {
            if (isRecord(value)) {
                return [key, filterSensitiveData(value)];
            }

            return [key, key === 'password' ? '******' : value];
        })
    );
};

const removeUndefinedKeys = (object: Record<string, unknown>) =>
    Object.fromEntries(Object.entries(object).filter(([, value]) => value !== undefined));

export class LogEntry {
    payload: LogContextPayload
    
    constructor(public readonly key: LogKey) {
        this.payload = {
            key,
            result: LogResult.Success
        }
    }
    
    prepend(data: Readonly<LogPayload>) {
        this.payload = {
            ...removeUndefinedKeys(data),
            ...this.payload
        }
    }

    append(data: Readonly<LogPayload>) {
        this.payload = {
            ...this.payload,
            ...filterSensitiveData(removeUndefinedKeys(data))
        }
    }
}

export type LogPayload = Partial<LogContextPayload>;

export type LogContext = {
    createLog: (key: LogKey) => LogEntry;
    prependAllLogEntries: (payload: LogPayload) => void;
}

export type WithLogContext<ContextT extends IRouterParamContext = IRouterParamContext & Context> =
    ContextT & LogContext