import {SignInExperienceSettings} from "../types";
import ky from "ky";
import {conditional, Nullable, Optional} from "@astoniq/essentials";

const buildSearchParameters = (record: Record<string, Nullable<Optional<string>>>) => {
    const entries = Object.entries(record).filter((entry): entry is [string, string] =>
        Boolean(entry[0] && entry[1])
    );

    return conditional(entries.length > 0 && entries);
};

export const getSignInExperience = async <T extends SignInExperienceSettings>(): Promise<T> => {
    return ky.get('/api/.well-known/sign-in-exp').json<T>()
}

export const getPhrases = async ({
                                     localLanguage, language
                                 }: { localLanguage?: string, language?: string }) => {
    return ky.extend({
        hooks: {
            beforeRequest: [
                request => {
                    if (localLanguage) {
                        request.headers.set('Accept-Language', localLanguage)
                    }
                }
            ]
        }
    })
        .get('/api/.well-known/phrases', {
            searchParams: buildSearchParameters({lng: language})
        })
}