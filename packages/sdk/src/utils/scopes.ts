import {ReservedScope, UserScope} from "@/types/index.js";

export const withDefaultScopes = (originalScopes?: string[]): string => {
    const reservedScopes = Object.values(ReservedScope);
    const uniqueScopes = new Set([...reservedScopes, UserScope.Profile, ...(originalScopes ?? [])])
    return Array.from(uniqueScopes).join(' ');
}