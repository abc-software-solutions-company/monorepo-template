import { FC, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Editor } from 'ckeditor5';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useLocale, useTranslations } from 'use-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import FormFieldCKEditor from '@repo/react-web-ui-shadcn/components/form-fields/form-field-ckeditor';
import FormFieldInputName from '@repo/react-web-ui-shadcn/components/form-fields/form-field-input-name';
import ModalLoading from '@repo/react-web-ui-shadcn/components/modals/modal-loading';
import { Card, CardContent } from '@repo/react-web-ui-shadcn/components/ui/card';
import { Form } from '@repo/react-web-ui-shadcn/components/ui/form';
import { objectToQueryString } from '@repo/shared-universal/utils/string.util';

import { FaqFormData } from '../interfaces/faqs.interface';

import { FAQ_STATUS, FAQ_STATUSES } from '../constants/faqs.constant';

import { useCreateFaqMutation, useGetFaqQuery, useUpdateFaqMutation } from '../hooks/use-faq-queries';

import EditorFileDialog from '@/components/editor-file-dialog';
import FormFieldCardSelectStatus from '@/components/form-fields/form-field-card-select-status';
import FormToolbar from '@/components/form-toolbar';

import { faqFormValidator } from '../validators/faq-form.validator';

type FaqFormProps = {
  isEdit: boolean;
};

const FaqForm: FC<FaqFormProps> = ({ isEdit }) => {
  const t = useTranslations();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = useParams();
  const locale = useLocale();
  const editorRef = useRef<Editor | null>(null);
  const [isFileManagerVisible, setIsFileManagerVisible] = useState(false);
  const { data: faq, isFetching } = useGetFaqQuery({ id: params.id as string, enabled: !!params.id });
  const { mutate: createMutation } = useCreateFaqMutation();
  const { mutate: updateMutation } = useUpdateFaqMutation();

  const defaultValues: FaqFormData = {
    title: faq?.title ?? '',
    content: faq?.content ?? '',
    status: faq?.status ?? FAQ_STATUS.DRAFT,
  };

  const form = useForm<FaqFormData>({ resolver: zodResolver(faqFormValidator), defaultValues });

  const onBackClick = () => {
    navigate({
      pathname: `/${locale}/faqs`,
      search: `?${objectToQueryString({ sidebar: searchParams.get('sidebar') })}`,
    });
  };

  const onCreateSuccess = () => {
    toast(t('faq_create_toast_title'), { description: t('faq_create_success') });
    onBackClick();
  };

  const onCreateFailure = (error: Error) => {
    let errorMessage = t('faq_create_failure');

    if (axios.isAxiosError(error) && error.response) {
      errorMessage += `\n${error.response.data.message}`;
    } else {
      errorMessage += `\n${error.message}`;
    }

    toast(t('faq_update_toast_title'), { description: errorMessage });
  };

  const onUpdateSuccess = () => {
    toast(t('faq_update_toast_title'), { description: t('faq_update_success') });
    onBackClick();
  };

  const onUpdateFailure = (error: Error) => {
    let errorMessage = t('faq_update_failure');

    if (axios.isAxiosError(error) && error.response) {
      errorMessage += `\n${error.response.data.message}`;
    } else {
      errorMessage += `\n${error.message}`;
    }

    toast(t('faq_update_toast_title'), { description: errorMessage });
  };

  const onSubmit: SubmitHandler<FaqFormData> = async formData => {
    if (isEdit) {
      updateMutation(
        { id: params.id as string, formData },
        {
          onSuccess: onUpdateSuccess,
          onError: onUpdateFailure,
        }
      );
    } else {
      createMutation(formData, {
        onSuccess: onCreateSuccess,
        onError: onCreateFailure,
      });
    }
  };

  useEffect(() => {
    form.reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, faq]);

  return (
    <div data-testid="frm-faq">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormToolbar className="mb-4" title={t('faq_details')} submitDisabled={isFetching} onBackClick={onBackClick} />
          <div className="flex gap-4">
            <Card className="grow">
              <CardContent className="grid gap-4 pt-4">
                <FormFieldInputName form={form} fieldName={'title'} />
                <FormFieldCKEditor form={form} editorRef={editorRef} setVisible={setIsFileManagerVisible} fieldName={'content'} />
              </CardContent>
            </Card>
            <div className="w-72 shrink-0">
              <div className="grid gap-4">
                <FormFieldCardSelectStatus form={form} statuses={FAQ_STATUSES} />
              </div>
            </div>
          </div>
        </form>
      </Form>
      <EditorFileDialog editorRef={editorRef} visible={isFileManagerVisible} setVisible={setIsFileManagerVisible} />
      <ModalLoading visible={isFetching} />
    </div>
  );
};

export default FaqForm;
