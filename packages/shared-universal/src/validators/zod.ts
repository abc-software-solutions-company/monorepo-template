import { z } from 'zod';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { Language } from '@repo/shared-universal/interfaces/language.interface';

export const baseValidator = {
  userName: stringSchema({
    min: 1,
    max: 50,
    minMessage: 'validator_user_name',
    maxMessage: 'validator_maximum_n_characters_allowed',
  }),
  email: stringSchema({
    min: 1,
    max: 320,
    minMessage: 'validator_user_email',
    maxMessage: 'validator_maximum_n_characters_allowed',
  }).email('validator_user_email_invalid'),
  password: passwordSchema(),
  phoneNumber: phoneNumberSchema(),
  // TODO: Will be removed
  seo: z.object({
    title: z
      .string()
      .nullable()
      .optional()
      .refine(value => !value || (value.length >= 1 && value.length <= 60), { message: 'validator_seo_title' }),
    description: z
      .string()
      .nullable()
      .optional()
      .refine(value => !value || (value.length >= 1 && value.length <= 150), { message: 'validator_seo_description' }),
    keywords: z
      .string()
      .nullable()
      .optional()
      .refine(value => !value || (value.length >= 1 && value.length <= 150), { message: 'validator_seo_keywords' }),
  }),
};

interface StringValidatorOptions {
  min?: number;
  max?: number;
  required?: boolean;
  minMessage?: string;
  maxMessage?: string;
  requiredMessage?: string;
}

interface PasswordValidatorOptions extends StringValidatorOptions {
  pattern?: RegExp;
  patternMessage?: string;
}

interface PhoneNumberValidatorOptions {
  invalidMessage?: string;
}

type CreateLocalizedFieldParams = {
  min?: number;
  max?: number;
  required?: boolean;
  requiredMessage?: string;
  maxMessage?: string;
  minMessage?: string;
  defaultRequiredMessage?: string;
};

export function stringSchema(options: Partial<StringValidatorOptions> = {}) {
  const {
    min,
    max,
    required = false,
    minMessage = 'validator_minimum_n_characters_allowed',
    maxMessage = 'validator_maximum_n_characters_allowed',
    requiredMessage = 'validator_required',
  } = options;

  let schema = z.string();

  if (required) {
    schema = schema.min(1, requiredMessage);
  }

  if (min !== undefined) {
    schema = schema.min(min, minMessage);
  }

  if (max !== undefined) {
    schema = schema.max(max, maxMessage);
  }

  return schema;
}

export function phoneNumberSchema(options: Partial<PhoneNumberValidatorOptions> = {}) {
  const { invalidMessage = 'validator_phone_number_invalid' } = options;

  return z.string().refine(
    (value: string) => {
      try {
        const phoneNumber = parsePhoneNumberFromString(value);
        return phoneNumber && phoneNumber.isValid();
      } catch (error) {
        return false;
      }
    },
    {
      message: invalidMessage,
    }
  );
}

export function passwordSchema(options: Partial<PasswordValidatorOptions> = {}) {
  const {
    min = 8,
    max = 255,
    minMessage = 'validator_user_password_at_least_n_character',
    maxMessage = 'validator_maximum_n_characters_allowed',
    pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
    patternMessage = 'validator_user_password_rule',
  } = options;

  return z.string().min(min, minMessage).max(max, maxMessage).regex(pattern, patternMessage);
}

export const createLocalizedField =
  (language: Language) =>
  ({
    min = 1,
    max = Infinity,
    required = false,
    requiredMessage = 'validator_required',
    minMessage = 'validator_minimum_n_characters_allowed',
    maxMessage = 'validator_maximum_n_characters_allowed',
    defaultRequiredMessage = 'validator_default_language_required',
  }: CreateLocalizedFieldParams = {}) => {
    let schema = z.array(z.object({ lang: z.string(), value: z.string() }));

    if (required) {
      schema = schema.min(1, requiredMessage);
    }

    return schema
      .refine(
        data => {
          if (!required && (!data || data.length === 0)) {
            return true;
          }

          const defaultTranslationValue = data.find(item => item.lang === language.code)?.value;

          return defaultTranslationValue && defaultTranslationValue.trim() !== '';
        },
        { message: defaultRequiredMessage }
      )
      .refine(
        data => {
          if (!min) return true;

          return data.every(item => item.value.length >= min);
        },
        {
          message: minMessage,
        }
      )
      .refine(
        data => {
          if (!max) return true;

          return data.every(item => item.value.length <= max);
        },
        {
          message: maxMessage,
        }
      );
  };
