import {IRouterParamContext} from "koa-router";
import {Context, Middleware} from "koa";
import {LogContextPayload, LogKey, LogResult} from "@astoniq/loam-schemas";
import {Queries} from "@/application/queries.js";
import {RequestError} from "@/errors/index.js";
import {pick} from "@astoniq/essentials";
import {generateStandardId} from "@astoniq/loam-shared";

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
    ContextT & LogContext;

export default function koaAuditLog<StateT, ContextT extends IRouterParamContext, ResponseBodyT>(
    {
        log: {insertLog}
    }: Queries): Middleware<StateT, WithLogContext<ContextT>, ResponseBodyT> {
    return async (ctx, next) => {
        const entries: LogEntry[] = [];

        ctx.createLog = (key: LogKey) => {
            const entry = new LogEntry(key)
            entries.push(entry)
            return entry
        }

        ctx.prependAllLogEntries = (payload) => {
            for (const entry of entries) {
                entry.append(payload)
            }
        }

        try {
            await next()
        } catch (error: unknown) {
            for (const entry of entries) {
                entry.append({
                        result: LogResult.Error,
                        error: error instanceof RequestError
                            ? pick(error, 'message', 'code', 'data')
                            : {message: String(error)}
                    }
                )
            }
            throw error;
        } finally {
            const {
                ip,
                headers: {'user-agent': userAgent}
            } = ctx.request;

            await Promise.all(
                entries.map(async ({payload}) => {
                    return insertLog({
                        id: generateStandardId(),
                        key: payload.key,
                        payload: {ip, userAgent, ...payload}
                    })
                })
            )
        }
    }
}