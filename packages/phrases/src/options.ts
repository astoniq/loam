import en from "@/locales/en";
import {z} from 'zod';
import {fallback, languages, LanguageTag} from "@astoniq/loam-language-kit";
import {BuiltInLanguageTag, Resource} from "@/types";

export const builtInLanguages = [
    'en',
] as const;

export const builtInLanguageOptions = builtInLanguages.map((languageTag) => ({
    value: languageTag,
    title: languages[languageTag],
}));

export const builtInLanguageTagGuard = z.enum(builtInLanguages);


export const getDefaultLanguageTag = (languages: string): LanguageTag =>
    builtInLanguageTagGuard.or(fallback<LanguageTag>('en')).parse(languages);

export const isBuiltInLanguageTag = (language: string): language is BuiltInLanguageTag =>
    builtInLanguageTagGuard.safeParse(language).success;

const resource: Resource = {
    en
};

export default resource;