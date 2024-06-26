import en from "./locales/en/index.js";
import {z} from 'zod';
import {NormalizeKeyPaths} from "@astoniq/essentials";
import {fallback, languages, LanguageTag} from "@astoniq/loam-language-kit";
import {LocalePhrase, Errors, Translation} from './types.js'

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

export const resources: Resources = {
    en
};


export type I18nKey = NormalizeKeyPaths<Translation>;

export type BuiltInLanguageTag = z.infer<typeof builtInLanguageTagGuard>;

export type LoamErrorCode = NormalizeKeyPaths<Errors>;
export type LoamErrorI18nKey = `errors:${LoamErrorCode}`;


export type Resources = Record<BuiltInLanguageTag, LocalePhrase>;