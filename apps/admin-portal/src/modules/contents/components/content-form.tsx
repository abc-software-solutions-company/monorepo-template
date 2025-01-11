import { FC, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Editor } from 'ckeditor5';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useLocale, useTranslations } from 'use-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import FormFieldCKEditor from '@repo/react-web-ui-shadcn/components/form-fields/form-field-ckeditor';
import FormFieldInput from '@repo/react-web-ui-shadcn/components/form-fields/form-field-input';
import FormFieldInputSlug from '@repo/react-web-ui-shadcn/components/form-fields/form-field-input-slug';
import ModalLoading from '@repo/react-web-ui-shadcn/components/modals/modal-loading';
import { Card, CardContent } from '@repo/react-web-ui-shadcn/components/ui/card';
import { Form } from '@repo/react-web-ui-shadcn/components/ui/form';
import { objectToQueryString } from '@repo/shared-universal/utils/string.util';

import { ContentFormData } from '../interfaces/contents.interface';

import { CONTENT_STATUS, CONTENT_STATUSES, CONTENT_TYPE } from '../constants/contents.constant';

import { useCreateContentMutation, useGetContentQuery, useUpdateContentMutation } from '../hooks/use-content-queries';

import EditorFileDialog from '@/components/editor-file-dialog';
import FormFieldCardInputType from '@/components/form-fields/form-field-card-input-type';
import FormFieldCardSelectStatus from '@/components/form-fields/form-field-card-select-status';
import FormFieldCardSeoMeta from '@/components/form-fields/form-field-card-seo-meta';
import FormToolbar from '@/components/form-toolbar';

import { contentFormValidator } from '../validators/content-form.validator';

type ContentFormProps = {
  isEdit: boolean;
};

const ContentForm: FC<ContentFormProps> = ({ isEdit }) => {
  const t = useTranslations();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = useParams();
  const locale = useLocale();
  const editorRef = useRef<Editor | null>(null);
  const [isFileManagerVisible, setIsFileManagerVisible] = useState(false);
  const { data: content, isFetching } = useGetContentQuery({ id: params.id as string, enabled: !!params.id });
  const { mutate: createMutation } = useCreateContentMutation();
  const { mutate: updateMutation } = useUpdateContentMutation();

  const defaultValues: ContentFormData = {
    status: content?.status ?? CONTENT_STATUS.DRAFT,
    name: content?.name ?? '',
    slug: content?.slug ?? '',
    description: content?.description ?? '',
    body: content?.body ?? '',
    type: content?.type ?? CONTENT_TYPE.UNCATEGORIZED,
    seoMeta: content?.seoMeta ?? { title: '', description: '', keywords: '' },
  };

  const form = useForm<ContentFormData>({ resolver: zodResolver(contentFormValidator), defaultValues });

  const onBackClick = () => {
    navigate({
      pathname: `/${locale}/contents`,
      search: `?${objectToQueryString({ sidebar: searchParams.get('sidebar') })}`,
    });
  };

  const onCreateSuccess = () => {
    toast(t('content_create_toast_title'), { description: t('content_create_success') });
    onBackClick();
  };

  const onCreateFailure = (error: Error) => {
    let errorMessage = t('content_create_failure');

    if (axios.isAxiosError(error) && error.response) {
      errorMessage += `\n${error.response.data.message}`;
    } else {
      errorMessage += `\n${error.message}`;
    }

    toast(t('content_update_toast_title'), { description: errorMessage });
  };

  const onUpdateSuccess = () => {
    toast(t('content_update_toast_title'), { description: t('content_update_success') });
    onBackClick();
  };

  const onUpdateFailure = (error: Error) => {
    let errorMessage = t('content_update_failure');

    if (axios.isAxiosError(error) && error.response) {
      errorMessage += `\n${error.response.data.message}`;
    } else {
      errorMessage += `\n${error.message}`;
    }

    toast(t('content_update_toast_title'), { description: errorMessage });
  };

  const onSubmit: SubmitHandler<ContentFormData> = async formData => {
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
  }, [form, content]);

  return (
    <div data-testid="frm-content">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormToolbar className="mb-4" title={t('content_details')} submitDisabled={isFetching} onBackClick={onBackClick} />
          <div className="flex gap-4">
            <Card className="grow">
              <CardContent className="grid gap-4 pt-4">
                <FormFieldInput form={form} fieldName="name" formLabel={t('form_field_name')} />
                <FormFieldInputSlug form={form} />
                <FormFieldCKEditor
                  form={form}
                  fieldName="description"
                  formLabel={t('form_field_description')}
                  editorRef={editorRef}
                  minHeight={120}
                  toolbar={['bold', 'italic', 'underline', 'strikethrough']}
                />
                <FormFieldCKEditor
                  form={form}
                  fieldName="body"
                  formLabel={t('form_field_content')}
                  editorRef={editorRef}
                  setVisible={setIsFileManagerVisible}
                />
              </CardContent>
              <CardContent className="grid gap-4 pt-4">
                <FormFieldCardSeoMeta form={form} />
              </CardContent>
            </Card>
            <div className="w-72 shrink-0">
              <div className="grid gap-4">
                <FormFieldCardSelectStatus form={form} statuses={CONTENT_STATUSES} />
                <FormFieldCardInputType form={form} />
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

export default ContentForm;
