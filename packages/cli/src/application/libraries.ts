import {Queries} from "@/application/queries.js";
import {createScopeLibrary} from "@/libraries/scope.js";
import {createUserLibrary} from "@/libraries/user.js";

export type Libraries = ReturnType<typeof createLibraries>

export type LibrariesOptions = {
    queries: Queries
}

export const createLibraries = (options: LibrariesOptions) => {

    const scope = createScopeLibrary(options.queries)
    const user = createUserLibrary(options.queries)

    return {
        user,
        scope
    }
}