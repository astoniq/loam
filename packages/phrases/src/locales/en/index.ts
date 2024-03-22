import translation from "./translation";
import errors from "./errors";
import {LocalePhrase} from "@/types";

const en: LocalePhrase = {
    translation,
    errors,
};

export default Object.freeze(en);