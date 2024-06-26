import {LoamErrorCode} from "@astoniq/loam-phrases";
import {assert} from "@astoniq/essentials";
import {RequestError} from "@/errors/index.js";


type AssertThatFunction = {
    <E extends Error>(value: unknown, error: E): asserts value;
    (value: unknown, error: LoamErrorCode, status?: number): asserts value;
}

const assertThat: AssertThatFunction = <E extends Error>(
    value: unknown,
    error: E | LoamErrorCode,
    status?: number
): asserts value => {
    assert(value, error instanceof Error ? error : new RequestError({code: error, status}));
}

export default assertThat