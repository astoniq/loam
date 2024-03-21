import {LoamErrorCode} from "@astoniq/loam-phrases";

export type RequestErrorMetadata = Record<string, unknown> & {
    code: LoamErrorCode;
    status?: number;
    expose?: boolean;
}

export type RequestErrorBody<T = unknown> = {
    message: string
    data: T
    code: LoamErrorCode;
    details?: string
}