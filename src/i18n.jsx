import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import {initReactI18next} from 'react-i18next';
import languageEn from './localizations/en.json';
import languageFR from './localizations/fr.json';

i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
        resources: {
            en: languageEn,
            fr: languageFR,
        },
        keySeparator: '.',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
