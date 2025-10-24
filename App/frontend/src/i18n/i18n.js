import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { locales, defaultLocale } from "./config";
import LanguageDetector from 'i18next-browser-languagedetector';

import en from "../locales/en.json";
import vn from "../locales/vn.json";
import ku from "../locales/ku.json";

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