import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { locales, defaultLocale } from "./config";

import en from "../locales/en.json";
import vn from "../locales/vn.json";
import ar from "../locales/ar.json";

i18n
    .use(initReactI18next)
    .init({
        fallbackLng: defaultLocale,
        supportedLngs: locales,
        resources: {
            EN: { translation: en },
            VN: { translation: vn },
            AR: { translation: ar },
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