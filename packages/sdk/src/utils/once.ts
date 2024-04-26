type Procedure<T> = (...args: unknown[]) => T;

export function once<T>(function_: Procedure<T>): Procedure<T> {
    let called = false;
    let result: T;

    return function (this: unknown, ...args: unknown[]) {
        if (!called) {
            called = true;
            result = function_.apply(this, args);
        }

        return result;
    };
}