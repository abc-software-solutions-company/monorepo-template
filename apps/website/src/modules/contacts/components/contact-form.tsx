import React, { FC } from 'react';
import { useTranslations } from 'next-intl';
import classNames from 'classnames';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Button } from '~react-web-ui-shadcn/components/ui/button';
import { Form } from '~react-web-ui-shadcn/components/ui/form';

import { ComponentBaseProps } from '@/interfaces/component.interface';
import { ContactFormData } from '../interfaces/contacts.interface';

import FormFieldInputEmail from '@/components/form-fields/form-field-input-email';
import FormFieldInputName from '@/components/form-fields/form-field-input-name';
import FormFieldTextAreaContent from '@/components/form-fields/form-field-text-area-content';

import ContactApi from '../api/contacts.api';
import { createContactValidator } from '../validators/create-contact.validator';

const ContactForm: FC<ComponentBaseProps> = ({ className }) => {
  const t = useTranslations();
  const mutation = useMutation({
    mutationFn: (formData: ContactFormData) => ContactApi.create(formData),
    onSuccess: async _resp => {
      toast(t('contact'), { description: t('contact_message_success') });
      form.reset(defaultValues);
    },
    onError: error => {
      toast(t('contact'), { description: t('contact_message_failure') + '<br />' + error.message });
    },
  });

  const defaultValues: ContactFormData = {
    name: '',
    email: '',
    message: '',
  };

  const form = useForm<ContactFormData>({ resolver: zodResolver(createContactValidator), defaultValues });

  const onSubmit: SubmitHandler<ContactFormData> = async formData => mutation.mutate(formData);

  return (
    <div className={classNames(className)}>
      <Form {...form}>
        <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormFieldInputName form={form} formLabel={t('contact_name')} fieldName="name" />
            <FormFieldInputEmail form={form} formLabel={t('contact_email')} fieldName="email" />
          </div>
          <FormFieldTextAreaContent form={form} formLabel={t('contact_message')} fieldName="message" />
          <div className="flex justify-center">
            <Button className="min-w-64" type="submit">
              {t('btn_send')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ContactForm;
