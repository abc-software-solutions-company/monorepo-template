import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import FormFieldInputName from '~react-web-ui-shadcn/components/form-fields/form-field-input-name';
import FormFieldTextAreaContent from '~react-web-ui-shadcn/components/form-fields/form-field-text-area-content';
import { Button } from '~react-web-ui-shadcn/components/ui/button';
import { Form } from '~react-web-ui-shadcn/components/ui/form';
import { Loading } from '~react-web-ui-shadcn/components/ui/loading';
import { useToast } from '~react-web-ui-shadcn/components/ui/use-toast';

import { SendNotificationDto } from '../interfaces/notifications.interface';

import NotificationApi from '../api/notifications.api';
import { sendPushNotificationValidator } from '../validators/send-push-notification.validator';

const PushNotificationPlayGround = () => {
  const t = useTranslations();
  const { toast } = useToast();

  const defaultValues = {
    title: '',
    content: '',
  } as SendNotificationDto;

  const form = useForm<SendNotificationDto>({ resolver: zodResolver(sendPushNotificationValidator), defaultValues });

  const mutation = useMutation({
    mutationFn: (formData: SendNotificationDto) => NotificationApi.send(formData),
    onSuccess: () => {
      toast({
        title: t('push_notification_toast_title'),
        description: t('push_notification_send_success'),
      });
    },
    onError: error => {
      toast({
        title: t('push_notification_toast_title'),
        description: t('push_notification_send_failure') + '<br />' + error.message,
      });
    },
  });

  const onSubmit: SubmitHandler<SendNotificationDto> = async formData => mutation.mutate(formData);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <FormFieldInputName form={form} fieldName="title" />
          <FormFieldTextAreaContent form={form} fieldName={'content'} maxLength={250} />
          <div>
            <Button type="submit" disabled={mutation.isPending} className="space-x-2">
              {mutation.isPending && <Loading size={'xs'} />}
              <span>{t('push_notification_send_button')}</span>
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default PushNotificationPlayGround;
