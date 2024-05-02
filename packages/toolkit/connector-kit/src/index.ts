import type { ZodType, ZodTypeDef } from 'zod';

import {
    ConnectorError,
    ConnectorErrorCodes,
    type SendMessagePayload,
    jsonGuard,
    jsonObjectGuard, Json, JsonObject,
} from './types/index.js';

export * from './types/index.js';

export function validateConfig<Output, Input = Output>(
    config: unknown,
    guard: ZodType<Output, ZodTypeDef, Input>
): asserts config is Output {
    const result = guard.safeParse(config);

    if (!result.success) {
        throw new ConnectorError(ConnectorErrorCodes.InvalidConfig, result.error);
    }
}

export const parseJson = (
    jsonString: string,
    errorCode: ConnectorErrorCodes = ConnectorErrorCodes.InvalidResponse,
    errorPayload?: unknown
): Json => {
    try {
        return jsonGuard.parse(JSON.parse(jsonString));
    } catch {
        throw new ConnectorError(errorCode, errorPayload ?? jsonString);
    }
};

export const parseJsonObject = (
    ...[jsonString, errorCode = ConnectorErrorCodes.InvalidResponse, errorPayload]: Parameters<
        typeof parseJson
    >
): JsonObject => {
    try {
        return jsonObjectGuard.parse(JSON.parse(jsonString));
    } catch {
        throw new ConnectorError(errorCode, errorPayload ?? jsonString);
    }
};

export const replaceSendMessageHandlebars = (
    template: string,
    payload: SendMessagePayload
): string => {
    return Object.keys(payload).reduce(
        (accumulator, key) =>
            accumulator.replaceAll(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), payload[key] ?? ''),
        template
    );
};