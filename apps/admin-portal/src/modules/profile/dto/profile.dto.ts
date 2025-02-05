/*
 * @Author: <Tin Tran> (tin.tran@abcdigital.io)
 * @Created: 2025-01-24 15:21:49
 */

import { ProfileFormData } from '../interfaces/profile.interface';

export type ProfilePayload = {
  [key: string]: unknown;
};

export const campaignStep3Dto = (formValues: ProfileFormData): Partial<ProfilePayload> => {
  return {
    ...formValues,
  };
};
