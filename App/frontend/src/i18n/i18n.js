import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { locales, defaultLocale } from "./config";
import LanguageDetector from 'i18next-browser-languagedetector';

import en from "../locales/en.json";
import vn from "../locales/vn.json";
import ku from "../locales/ku.json";
import se from "../locales/se.json";
import fi from "../locales/fi.json";
import hi from "../locales/hi.json";
import uk from "../locales/uk.json";
import ar from "../locales/ar.json";

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: defaultLocale,
        supportedLngs: locales,
        resources: {
            EN: { translation: en },
            VN: { translation: vn },
            KU: { translation: ku },
            SE: { translation: se },
            FI: { translation: fi },
            HI: { translation: hi },
            UA: { translation: uk },
            AR: { translation: ar }
        },
        detection: {
            order: ['cookie'],
            caches: ['cookie'],
            cookieMinutes: 60 * 24 * 30,
        },
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;