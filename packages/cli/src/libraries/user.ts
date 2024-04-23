import {Queries} from "@/application/queries.js";


export const createUserLibrary = (queries: Queries) => {

    const {
        role: {findRoleByIds},
        userRole: {findUserRolesByUserId}
    } = queries;

    const findUserRoles = async (userId: string) => {
        const userRoles = await findUserRolesByUserId(userId)
        return await findRoleByIds(userRoles.map(({roleId}) => roleId))
    }

    return {
        findUserRoles
    }
}