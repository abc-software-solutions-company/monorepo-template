export type Locale = {
  languageLabel: string;
  languageName: string;
  isDefault: boolean;
};

export type TranslationValue = {
  lang: string;
  value: string;
};

export type FormFieldTranslationProps = {
  value?: TranslationValue[];
  onChange: (value: TranslationValue[]) => void;
};
