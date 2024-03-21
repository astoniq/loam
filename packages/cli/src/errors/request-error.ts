import {LoamErrorCode} from "@astoniq/loam-phrases";
import {RequestErrorMetadata} from "@astoniq/loam-schemas";


export default class RequestError extends Error {
    code: LoamErrorCode
    status: number
    expose: boolean
    data: unknown

    constructor(input: RequestErrorMetadata | LoamErrorCode, data?: unknown) {
        const {
            code,
            status = 400,
            expose = true,
            ...interpolation
        } = typeof input === 'string' ? {code: input} : input

        super();

        this.name = 'RequestError';
        this.expose = expose;
        this.code = code;
        this.status = status;
        this.data = data;
    }
}