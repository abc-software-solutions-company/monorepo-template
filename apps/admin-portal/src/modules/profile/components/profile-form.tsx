import { FC, useEffect } from 'react';
import classNames from 'classnames';
import { parseISO } from 'date-fns';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useLocale, useTranslations } from 'use-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Button } from '~react-web-ui-shadcn/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~react-web-ui-shadcn/components/ui/card';
import { Form } from '~react-web-ui-shadcn/components/ui/form';
import { Separator } from '~react-web-ui-shadcn/components/ui/separator';
import { objectToQueryString } from '~shared-universal/utils/string.util';

import { ComponentBaseProps } from '@/interfaces/component.interface';
import { ProfileFormData } from '../interfaces/profile.interface';

import FormFieldInputDatePicker from '@/components/form-fields/form-field-input-date-picker';
import FormFieldInputPhoneNumber from '@/components/form-fields/form-field-input-phone-number';
import FormFieldInputUserName from '@/components/form-fields/form-field-input-user-name';
import FormFieldSelectCountry from '@/components/form-fields/form-field-select-country';
import FormFieldTextAreaContent from '@/components/form-fields/form-field-text-area-content';

import { UserEntity } from '@/modules/users/interfaces/users.interface';

import ProfileApi from '../api/profile.api';
import { updateProfileValidator } from '../validators/update-profile.validator';

type ProfileFormProps = ComponentBaseProps & {
  user: UserEntity;
};

const ProfileForm: FC<ProfileFormProps> = ({ className, user }) => {
  const t = useTranslations();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const locale = useLocale();

  const mutation = useMutation({
    mutationFn: (formData: ProfileFormData) => ProfileApi.update(formData),
    onSuccess: async _resp => {
      toast(t('profile_update'), { description: t('profile_update_success') });
      navigate({
        pathname: `/${locale}/profile/overview`,
        search: `?${objectToQueryString({ sidebar: searchParams.get('sidebar') })}`,
      });
    },
    onError: error => {
      toast(t('profile_update'), { description: t('profile_update_failure') + '<br />' + error.message });
    },
  });

  const defaultValues: ProfileFormData = {
    name: user.name ?? '',
    phoneNumber: user.phoneNumber ?? '',
    dateOfBirth: user.dateOfBirth ? parseISO(user.dateOfBirth) : new Date(1970, 0, 1),
    country: user.country ?? '',
    bio: user.bio ?? '',
  };

  const form = useForm<ProfileFormData>({ resolver: zodResolver(updateProfileValidator), defaultValues });

  const onSubmit: SubmitHandler<ProfileFormData> = async formData => mutation.mutate(formData);

  useEffect(() => {
    form.reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, user]);

  return (
    <div className={classNames('about-form', className)}>
      <Card>
        <CardHeader>
          <CardTitle>{t('profile_about_me')}</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="p-4">
          <Form {...form}>
            <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-2 gap-4">
                <FormFieldInputUserName form={form} formLabel={t('profile_name')} fieldName="name" />
                <FormFieldInputPhoneNumber form={form} formLabel={t('profile_phone_number')} fieldName="phoneNumber" />
                <FormFieldInputDatePicker form={form} formLabel={t('profile_date_of_birth')} fieldName="dateOfBirth" />
                <FormFieldSelectCountry form={form} formLabel={t('profile_country')} fieldName="country" />
              </div>
              <div>
                <FormFieldTextAreaContent form={form} formLabel={t('profile_bio')} fieldName="bio" />
              </div>
              {/* Submit */}
              <div className="flex justify-end">
                <Button className="min-w-48" type="submit">
                  {t('btn_update')}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileForm;
