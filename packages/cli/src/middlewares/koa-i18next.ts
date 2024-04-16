import {IRouterParamContext} from "koa-router";
import {Middleware} from "koa";
import detectLanguage from "@/i18n/detect-language.js";
import {i18next} from "@/utils/i18n.js";

type LanguageUtils = {
    formatLanguageCode(code: string): string;
    isSupportedCode(code: string): boolean;
}


export type WithI18nContext<ContextT extends IRouterParamContext = IRouterParamContext> =
    ContextT & {
    locale: string
}

export default function koaI18next<StateT,
    ContextT extends IRouterParamContext,
    ResponseBodyT>(): Middleware<StateT, WithI18nContext<ContextT>, ResponseBodyT> {
    return async (ctx, next) => {
        const languages = detectLanguage(ctx)

        const languageUtils = i18next.services.languageUtils as LanguageUtils;

        const foundLanguage = languages
            .map((code) => languageUtils.formatLanguageCode(code))
            .find((code) => languageUtils.isSupportedCode(code));

        await i18next.changeLanguage(foundLanguage)
        ctx.locale = i18next.language

        return next()
    }
}