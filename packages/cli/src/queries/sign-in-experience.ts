import {CommonQueryMethods} from "slonik";
import {buildFindEntityByIdWithPool, buildUpdateWhereWithPool} from "@/database/index.js";
import {signInExperienceEntity} from "@/entities/index.js";
import {CreateSignInExperience, signInExperienceGuard} from "@astoniq/loam-schemas";

const id = 'default'

export const createSignInExperienceQueries = (pool: CommonQueryMethods) => {

    const findSignInExperienceById = buildFindEntityByIdWithPool(pool)(signInExperienceEntity, signInExperienceGuard)

    const updateSignInExperience = buildUpdateWhereWithPool(pool)(signInExperienceEntity, signInExperienceGuard)

    const findDefaultSignInExperience = () => findSignInExperienceById(id)

    const updateDefaultSignInExperience = (set: Partial<CreateSignInExperience>) =>
        updateSignInExperience({set, where: {id}, jsonbMode: 'replace'})

    return {
        findDefaultSignInExperience,
        updateDefaultSignInExperience
    }
}