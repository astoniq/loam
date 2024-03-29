import {Queries} from "@/context/queries.js";
import {createScopeLibrary} from "@/libraries/scope.js";

export type Libraries = ReturnType<typeof createLibraries>

export type LibrariesOptions = {
    queries: Queries
}

export const createLibraries = (options: LibrariesOptions) => {

    const scope = createScopeLibrary(options.queries)

    return {
        scope
    }
}