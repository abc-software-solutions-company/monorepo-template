import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import FormFieldInput from '@repo/react-web-ui-shadcn/components/form-fields/form-field-input';
import FormFieldTextArea from '@repo/react-web-ui-shadcn/components/form-fields/form-field-text-area';
import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';
import { Form } from '@repo/react-web-ui-shadcn/components/ui/form';
import { Loading } from '@repo/react-web-ui-shadcn/components/ui/loading';
import { useToast } from '@repo/react-web-ui-shadcn/components/ui/use-toast';
import { useMutation } from '@tanstack/react-query';

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
          <FormFieldInput form={form} fieldName="title" formLabel={t('form_field_name')} labelDisplay="outside" size="sm" translator={t} />
          <FormFieldTextArea
            form={form}
            fieldName="content"
            formLabel={t('form_field_content')}
            maxLength={250}
            labelDisplay="outside"
            textareaClassName="min-h-32"
            translator={t}
          />
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
