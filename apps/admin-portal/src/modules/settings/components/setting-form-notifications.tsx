import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@repo/react-web-ui-shadcn/components/ui/form';
import { Switch } from '@repo/react-web-ui-shadcn/components/ui/switch';
import useDeepCompareEffect from '@repo/shared-universal/hooks/use-deep-compare-effect';
import { useMutation } from '@tanstack/react-query';

import { NotificationFormValues } from '../interfaces/settings.interface';

import { useAuthState } from '@/modules/auth/states/auth.state';

import SettingApi from '../api/settings.api';
import { updateNotificationsValidator } from '../validators/update-notifications.validator';

export function SettingFormNotifications() {
  const t = useTranslations();
  const { user, setPreference } = useAuthState();

  const defaultValues: NotificationFormValues = {
    emailMarketing: user?.preference.emailMarketing || true,
    emailSocial: user?.preference.emailSocial || true,
  };

  const form = useForm<NotificationFormValues>({ resolver: zodResolver(updateNotificationsValidator), defaultValues });
  const mutation = useMutation({
    mutationFn: (formData: NotificationFormValues) => SettingApi.updatePreference(formData),
    onSuccess: async resp => {
      const preference = resp.data.data;

      toast(t('appearance_update_title'), { description: t('appearance_update_success') });

      setPreference(preference);
    },
    onError: error => {
      toast(t('appearance_update_title'), { description: t('appearance_update_failure') + '<br />' + error.message });
    },
  });

  const onSubmit: SubmitHandler<NotificationFormValues> = async formData => {
    mutation.mutate(formData);
  };

  useDeepCompareEffect(() => {
    form.reset(defaultValues);
  }, [user?.preference]);

  return (
    <Form {...form}>
      <h3 className="mb-4 font-medium">Email Notifications</h3>
      <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="emailMarketing"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Marketing emails</FormLabel>
                <FormDescription>Receive emails about new products, features, and more.</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="emailSocial"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Social emails</FormLabel>
                <FormDescription>Receive emails for friend requests, follows, and more.</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">{t('update')}</Button>
      </form>
    </Form>
  );
}
