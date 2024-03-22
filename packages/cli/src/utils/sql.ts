
export const autoSetFields = Object.freeze(['createdAt', 'updatedAt'] as const)

export type OmitAutoSetFields<T> = Omit<T, (typeof autoSetFields)[number]>