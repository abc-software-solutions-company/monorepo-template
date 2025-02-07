import React, { FC, useState } from 'react';
import { useTranslations } from 'next-intl';
import classNames from 'classnames';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormFieldInput from '@repo/react-web-ui-shadcn/components/form-fields/form-field-input';
import FormFieldTextArea from '@repo/react-web-ui-shadcn/components/form-fields/form-field-text-area';
import ModalError from '@repo/react-web-ui-shadcn/components/modals/modal-error';
import ModalSuccess from '@repo/react-web-ui-shadcn/components/modals/modal-success';
import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';
import { Form } from '@repo/react-web-ui-shadcn/components/ui/form';
import { useMutation } from '@tanstack/react-query';

import { ComponentBaseProps } from '@/interfaces/component.interface';
import { ContactFormData } from '../interfaces/contacts.interface';

import ContactApi from '../api/contacts.api';
import { contactFormSchema } from '../validators/create-contact.validator';

const ContactForm: FC<ComponentBaseProps> = ({ className }) => {
  const t = useTranslations();
  const [isShowSuccessModal, setIsShowSuccessModal] = useState(false);
  const [isShowErrorModal, setIsShowErrorModal] = useState(false);

  const defaultValues: ContactFormData = {
    name: '',
    email: '',
    subject: '',
    message: '',
  };

  const form = useForm<ContactFormData>({ resolver: zodResolver(contactFormSchema), defaultValues });

  const onCreateSuccess = () => {
    setIsShowSuccessModal(true);
    form.reset(defaultValues);
  };

  const onCreateFailure = () => {
    setIsShowErrorModal(true);
  };

  const handleCloseSuccessModal = () => {
    setIsShowSuccessModal(false);
  };

  const handleCloseErrorModal = () => {
    setIsShowErrorModal(false);
  };

  const mutation = useMutation({
    mutationFn: (formData: ContactFormData) => ContactApi.create(formData),
    onSuccess: onCreateSuccess,
    onError: onCreateFailure,
  });

  const onSubmit: SubmitHandler<ContactFormData> = async formData => {
    mutation.mutate(formData);
  };

  return (
    <div className={classNames(className)}>
      <Form {...form}>
        <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormFieldInput
              form={form}
              formLabel={t('contact_name')}
              fieldName="name"
              minLength={1}
              maxLength={255}
              labelDisplay="outside"
              size="sm"
              translator={t}
            />
            <FormFieldInput
              form={form}
              formLabel={t('contact_email')}
              fieldName="email"
              minLength={1}
              maxLength={320}
              labelDisplay="outside"
              size="sm"
              translator={t}
            />
          </div>
          <div>
            <FormFieldInput form={form} formLabel={t('contact_subject')} fieldName="subject" labelDisplay="outside" size="sm" translator={t} />
          </div>
          <FormFieldTextArea form={form} formLabel={t('contact_message')} fieldName="message" labelDisplay="outside" translator={t} />
          <div className="flex justify-center">
            <Button className="min-w-64" type="submit">
              {t('btn_send')}
            </Button>
          </div>
        </form>
      </Form>
      <ModalSuccess
        visible={isShowSuccessModal}
        title={t('contact_title_success')}
        message={t('contact_message_success')}
        onClose={handleCloseSuccessModal}
      />
      <ModalError
        visible={isShowErrorModal}
        title={t('contact_title_failure')}
        message={t('contact_message_failure')}
        onClose={handleCloseErrorModal}
      />
    </div>
  );
};

export default ContactForm;
