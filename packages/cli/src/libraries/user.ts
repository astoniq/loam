import {Queries} from "@/application/queries.js";
import {Nullable} from "@astoniq/essentials";
import {CreateUser, User, userGuard, UsersPasswordEncryptionMethod} from "@astoniq/loam-schemas";
import assertThat from "@/utils/assert-that.js";
import {RequestError} from "@/errors/index.js";
import {argon2Verify} from "hash-wasm";
import {OmitAutoSetFields} from "@/utils/sql.js";
import {buildInsertIntoWithPool} from "@/database/index.js";
import {userEntity} from "@/entities/index.js";


export const createUserLibrary = (queries: Queries) => {

    const {
        pool,
        role: {findRoleByIds},
        userRole: {findUserRolesByUserId}
    } = queries;

    const findUserRoles = async (userId: string) => {
        const userRoles = await findUserRolesByUserId(userId)
        return await findRoleByIds(userRoles.map(({roleId}) => roleId))
    }

    const insertUser = async (data: OmitAutoSetFields<CreateUser>) => {


        return pool.transaction(async (connection) => {
            const insertUserQuery = buildInsertIntoWithPool(connection)(userEntity, userGuard, {
                returning: true
            })

            return await insertUserQuery(data)
        })
    }

    const verifyUserPassword = async (user: Nullable<User>, password: string) => {
        assertThat(user, new RequestError({code: 'session.invalid_credentials', status: 422}));
        const {passwordEncrypted, passwordEncryptionMethod} = user;

        assertThat(passwordEncrypted && passwordEncryptionMethod,
            new RequestError({code: 'session.invalid_credentials', status: 422}))

        switch (passwordEncryptionMethod) {
            case UsersPasswordEncryptionMethod.Argon2i:
                const result = await argon2Verify({password, hash: passwordEncrypted});
                assertThat(result, new RequestError({code: 'session.invalid_credentials', status: 422}))
                break;
        }

        return user
    }

    return {
        insertUser,
        findUserRoles,
        verifyUserPassword
    }
}