import { FC, useEffect } from 'react';
import classNames from 'classnames';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useLocale, useTranslations } from 'use-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import Debugger from '@repo/react-web-ui-shadcn/components/debugger';
import FormFieldInput from '@repo/react-web-ui-shadcn/components/form-fields/form-field-input';
import FormFieldInputDatePicker from '@repo/react-web-ui-shadcn/components/form-fields/form-field-input-date-picker';
import FormFieldTextArea from '@repo/react-web-ui-shadcn/components/form-fields/form-field-text-area';
import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/react-web-ui-shadcn/components/ui/card';
import { Form } from '@repo/react-web-ui-shadcn/components/ui/form';
import { Separator } from '@repo/react-web-ui-shadcn/components/ui/separator';
import { getFormatByLocale } from '@repo/shared-universal/utils/date.util';
import { objectToQueryString } from '@repo/shared-universal/utils/string.util';
import { useMutation } from '@tanstack/react-query';

import { ComponentBaseProps } from '@/interfaces/component.interface';
import { ProfileFormData } from '../interfaces/profile.interface';

import { QUERY_PROFILE_ME } from '../constants/profile.constant';

import FormFieldSelectCountry from '@/components/form-fields/form-field-select-country';

import { UserEntity } from '@/modules/users/interfaces/users.interface';

import { getQueryClient } from '@/utils/query-client.util';

import ProfileApi from '../api/profile.api';
import { updateProfileValidator } from '../validators/update-profile.validator';

type ProfileFormProps = ComponentBaseProps & {
  user: UserEntity;
};

const queryClient = getQueryClient();

const ProfileForm: FC<ProfileFormProps> = ({ className, user }) => {
  const t = useTranslations();
  const locale = useLocale();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (formData: ProfileFormData) => ProfileApi.update(formData),
    onSuccess: async _resp => {
      toast(t('profile_update'), {
        description: t('profile_update_success'),
      });

      navigate({
        pathname: `/${locale}/profile/overview`,
        search: `?${objectToQueryString({ sidebar: searchParams.get('sidebar') })}`,
      });

      await queryClient.invalidateQueries({ queryKey: [QUERY_PROFILE_ME] });
    },
    onError: error => {
      toast(t('profile_update'), {
        description: t('profile_update_failure') + '<br />' + error.message,
      });
    },
  });

  const defaultValues: ProfileFormData = {
    name: user.name ?? '',
    phoneNumber: user.phoneNumber ?? '',
    dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : undefined,
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
                <FormFieldInput
                  form={form}
                  formLabel={t('profile_name')}
                  fieldName="name"
                  pattern={{ regex: /^[a-zA-Z0-9s]+$/ }}
                  labelDisplay="outside"
                  size="sm"
                  translator={t}
                />
                <FormFieldInput
                  form={form}
                  formLabel={t('profile_phone_number')}
                  fieldName="phoneNumber"
                  labelDisplay="outside"
                  size="sm"
                  translator={t}
                />
                <FormFieldInputDatePicker
                  form={form}
                  formLabel={t('profile_date_of_birth')}
                  fieldName="dateOfBirth"
                  size="sm"
                  labelDisplay="outside"
                  dateFormat={getFormatByLocale(locale)}
                  translator={t}
                />
                <FormFieldSelectCountry form={form} formLabel={t('profile_country')} fieldName="country" />
              </div>
              <div>
                <FormFieldTextArea form={form} formLabel={t('profile_bio')} fieldName="bio" labelDisplay="outside" translator={t} />
              </div>
              <div className="flex justify-end">
                <Button className="min-w-48" type="submit">
                  {t('btn_update')}
                </Button>
              </div>
              <Debugger text={JSON.stringify(form.formState.errors, null, 2)} />
              <Debugger text={JSON.stringify(form.watch(), null, 2)} />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileForm;
