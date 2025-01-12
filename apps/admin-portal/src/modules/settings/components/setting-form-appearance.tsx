import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@repo/react-web-ui-shadcn/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@repo/react-web-ui-shadcn/components/ui/radio-group';
import useDeepCompareEffect from '@repo/shared-universal/hooks/use-deep-compare-effect';
import { useMutation } from '@tanstack/react-query';

import { AppearanceFormValues } from '../interfaces/settings.interface';

import { useAuthState } from '@/modules/auth/states/auth.state';

import SettingApi from '../api/settings.api';
import { updateAppearanceValidator } from '../validators/update-appearance.validator';

export function SettingFormAppearance() {
  const t = useTranslations();
  const { user, setPreference } = useAuthState();

  const defaultValues = {
    theme: user?.preference.theme ?? 'dark',
  } as AppearanceFormValues;

  const form = useForm<AppearanceFormValues>({ resolver: zodResolver(updateAppearanceValidator), defaultValues });
  const mutation = useMutation({
    mutationFn: (formData: AppearanceFormValues) => SettingApi.updatePreference(formData),
    onSuccess: async resp => {
      const preference = resp.data.data;

      toast(t('appearance_update_title'), { description: t('appearance_update_success') });

      setPreference(preference);
    },
    onError: error => {
      toast(t('appearance_update_title'), { description: t('appearance_update_failure') + '<br />' + error.message });
    },
  });

  const onSubmit: SubmitHandler<AppearanceFormValues> = async formData => {
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
          name="theme"
          render={({ field, fieldState: { error } }) => (
            <FormItem className="space-y-1">
              <FormLabel>{t('theme')}</FormLabel>
              <FormDescription>{t('sidebar_menu_settings_appearance_theme_desc')}</FormDescription>
              {error?.message && <FormMessage message={t(error.message)} />}
              <RadioGroup value={field.value} className="grid max-w-md grid-cols-2 gap-8 pt-2" onValueChange={field.onChange}>
                <FormItem>
                  <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                    <FormControl>
                      <RadioGroupItem value="light" className="sr-only" />
                    </FormControl>
                    <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                      <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                        <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                          <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                          <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                        </div>
                        <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                          <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                          <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                        </div>
                        <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                          <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                          <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                        </div>
                      </div>
                    </div>
                    <span className="block w-full p-2 text-center font-normal">{t('theme_light')}</span>
                  </FormLabel>
                </FormItem>
                <FormItem>
                  <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                    <FormControl>
                      <RadioGroupItem value="dark" className="sr-only" />
                    </FormControl>
                    <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
                      <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                        <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                          <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                          <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                        </div>
                        <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                          <div className="h-4 w-4 rounded-full bg-slate-400" />
                          <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                        </div>
                        <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                          <div className="h-4 w-4 rounded-full bg-slate-400" />
                          <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                        </div>
                      </div>
                    </div>
                    <span className="block w-full p-2 text-center font-normal">{t('theme_dark')}</span>
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormItem>
          )}
        />
        <Button type="submit">{t('update')}</Button>
      </form>
    </Form>
  );
}
