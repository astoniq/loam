import {resources} from "@astoniq/loam-phrases";
import i18next from "i18next";

export async function initI18n() {
    await i18next.init({
        fallbackLng: 'en',
        supportedLngs: Object.keys(resources),
        resources
    })
}