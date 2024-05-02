import {Queries} from "@/application/queries.js";
import {createScopeLibrary} from "@/libraries/scope.js";
import {createUserLibrary} from "@/libraries/user.js";
import {createPasscodeLibrary} from "@/libraries/passcode.js";

export type Libraries = ReturnType<typeof createLibraries>

export type LibrariesOptions = {
    queries: Queries
}

export const createLibraries = (options: LibrariesOptions) => {

    const scope = createScopeLibrary(options.queries)
    const user = createUserLibrary(options.queries)
    const passcode = createPasscodeLibrary(options.queries)

    return {
        user,
        passcode,
        scope
    }
}