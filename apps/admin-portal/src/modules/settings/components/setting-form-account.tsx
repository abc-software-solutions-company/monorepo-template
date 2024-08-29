import { SubmitHandler, useForm } from 'react-hook-form';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useLocale, useTranslations } from 'use-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Button } from '~react-web-ui-shadcn/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~react-web-ui-shadcn/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~react-web-ui-shadcn/components/ui/select';
import useDeepCompareEffect from '~shared-universal/hooks/use-deep-compare-effect';
import { objectToQueryString } from '~shared-universal/utils/string.util';

import { AccountFormValues } from '../interfaces/settings.interface';

import { useAuthState } from '@/modules/auth/states/auth.state';

import SettingApi from '../api/settings.api';
import { updateAccountValidator } from '../validators/update-account.validator';

export function SettingFormAccount() {
  const t = useTranslations();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const locale = useLocale();
  const { user, setPreference } = useAuthState();

  const defaultValues = {
    language: user?.preference.language ?? locale,
  } as AccountFormValues;

  const form = useForm<AccountFormValues>({ resolver: zodResolver(updateAccountValidator), defaultValues });
  const mutation = useMutation({
    mutationFn: (formData: AccountFormValues) => SettingApi.updatePreference(formData),
    onSuccess: async resp => {
      const preference = resp.data.data;

      toast(t('appearance_update_title'), { description: t('appearance_update_success') });

      setPreference(preference);

      navigate({
        pathname: location.pathname.replace(/^\/[^/]+/, `/${preference.language}`),
        search: `?${objectToQueryString({ sidebar: searchParams.get('sidebar') })}`,
      });
    },
    onError: error => {
      toast(t('appearance_update_title'), { description: t('appearance_update_failure') + '<br />' + error.message });
    },
  });

  const onSubmit: SubmitHandler<AccountFormValues> = async formData => {
    mutation.mutate(formData);
  };

  useDeepCompareEffect(() => {
    form.reset(defaultValues);
  }, [user?.preference]);

  return (
    <Form {...form}>
      <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="language"
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <FormLabel>{t('language')}</FormLabel>
              <div className="relative w-max">
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en-us">United States</SelectItem>
                      <SelectItem value="vi-vn">Vietnamese</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </div>
              <FormDescription>{t('sidebar_menu_settings_appearance_language_desc')}</FormDescription>
              {error?.message && <FormMessage message={t(error.message)} />}
            </FormItem>
          )}
        />
        <Button type="submit">{t('update')}</Button>
      </form>
    </Form>
  );
}
