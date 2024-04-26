
export type Requester = <T>(...args:Parameters<typeof fetch>) => Promise<T>;