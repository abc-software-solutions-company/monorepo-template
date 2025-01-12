import { Language } from '../interfaces/language.interface';

export const LANGUAGES: Language[] = [
  { name: 'English', code: 'en-us', isDefault: true },
  { name: 'Tiếng Việt', code: 'vi-vn', isDefault: false },
];

export const LANGUAGE_LABELS = LANGUAGES.reduce(
  (acc, lang) => {
    acc[lang.code] = lang.name;

    return acc;
  },
  {} as Record<string, string>
);
