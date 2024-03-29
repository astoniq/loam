import {Queries} from "@/application/queries.js";

export const createScopeLibrary = (queries: Queries) => {

    const {
        resource: {findResourceByIds}
    } = queries;

    const attachResourceToScopes = async (scopes: string[]) => {
        return await findResourceByIds(scopes);
    }

    return {
        attachResourceToScopes
    }
}