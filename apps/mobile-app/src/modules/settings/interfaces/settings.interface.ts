import { ResponseFormat } from '@/interfaces/api-response.interface';

export type Languages = 'en-us' | 'vi-vn';

export type PreferenceEntity = {
  language: Languages;
  theme: string;
  fontSize: number;
  fontFamily: number;
  emailMarketing: boolean;
  emailSocial: boolean;
};

export type AccountFormValues = Partial<Pick<PreferenceEntity, 'language'>>;
export type AppearanceFormValues = Partial<Pick<PreferenceEntity, 'theme'>>;
export type NotificationFormValues = Partial<Pick<PreferenceEntity, 'emailMarketing' | 'emailSocial'>>;

export type UpdatePreferenceDto = Partial<PreferenceEntity>;

export type PreferenceResponse = ResponseFormat<PreferenceEntity>;
