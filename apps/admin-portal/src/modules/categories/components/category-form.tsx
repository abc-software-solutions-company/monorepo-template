import { FC, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Editor } from 'ckeditor5';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useLocale, useTranslations } from 'use-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import Debugger from '@repo/react-web-ui-shadcn/components/debugger';
import FormFieldCKEditorMultiLanguage from '@repo/react-web-ui-shadcn/components/form-fields/form-field-ckeditor-multi-language';
import FormFieldInputDatePicker from '@repo/react-web-ui-shadcn/components/form-fields/form-field-input-date-picker';
import FormFieldInputMultiLanguage from '@repo/react-web-ui-shadcn/components/form-fields/form-field-input-multi-language';
import FormFieldInputSlug from '@repo/react-web-ui-shadcn/components/form-fields/form-field-input-slug';
import ModalLoading from '@repo/react-web-ui-shadcn/components/modals/modal-loading';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/react-web-ui-shadcn/components/ui/card';
import { Form } from '@repo/react-web-ui-shadcn/components/ui/form';
import { getLanguages } from '@repo/shared-universal/utils/language.util';
import { objectToQueryString } from '@repo/shared-universal/utils/string.util';

import { CategoryFormData } from '../interfaces/categories.interface';

import { CATEGORY_STATUS, CATEGORY_STATUSES, CATEGORY_TYPE } from '../constants/categories.constant';

import {
  useCreateCategoryMutation,
  useGetCategoriesByTypeQuery,
  useGetCategoryQuery,
  useUpdateCategoryMutation,
} from '../hooks/use-category-queries';

import EditorFileDialog from '@/components/editor-file-dialog';
import FormFieldCardCoverMultiLanguage from '@/components/form-fields/form-field-card-cover-multi-language';
import FormFieldCardImages from '@/components/form-fields/form-field-card-images';
import FormFieldCardSelectCategory from '@/components/form-fields/form-field-card-select-category';
import FormFieldCardSelectStatus from '@/components/form-fields/form-field-card-select-status';
import FormFieldCardSeoMeta from '@/components/form-fields/form-field-card-seo-meta';
import FormToolbar from '@/components/form-toolbar';

import { FileEntity } from '@/modules/files/interfaces/files.interface';

import { categoryFormLocalizeSchema } from '../validators/category-form.validator';

type CategoryFormProps = {
  isEdit: boolean;
};

const CategoryForm: FC<CategoryFormProps> = ({ isEdit }) => {
  const t = useTranslations();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = useParams();
  const locale = useLocale();
  const editorRef = useRef<Editor | null>(null);
  const [isFileManagerVisible, setIsFileManagerVisible] = useState(false);
  const { data: content, isFetching } = useGetCategoryQuery({ id: params.id as string, enabled: !!params.id });
  const { data: categoriesByType, isFetching: isCategoriesByTypeFetching } = useGetCategoriesByTypeQuery({
    filter: { type: searchParams.get('type') as CATEGORY_TYPE },
    excludeId: params.id,
  });

  const { mutate: createMutation } = useCreateCategoryMutation();
  const { mutate: updateMutation } = useUpdateCategoryMutation();

  const languages = getLanguages(locale);

  const defaultValues: CategoryFormData = {
    status: content?.data.status ?? CATEGORY_STATUS.PUBLISHED,
    slug: content?.data.slug ?? '',
    type: content?.data.type ?? (searchParams.get('type') as CATEGORY_TYPE),
    coverLocalized: content?.data.coverLocalized ?? [],
    nameLocalized: content?.data.nameLocalized ?? [],
    descriptionLocalized: content?.data.descriptionLocalized ?? [],
    bodyLocalized: content?.data.bodyLocalized ?? [],
    images: content?.data.images ?? ([] as FileEntity[]),
    parentId: content?.data.parent?.id ?? undefined,
    publishDate: content?.data.publishDate ? new Date(content.data.publishDate) : undefined,
    externalUrl: content?.data.externalUrl ?? '',
    seoMeta: {
      titleLocalized: content?.data.seoMeta?.titleLocalized ?? [],
      descriptionLocalized: content?.data.seoMeta?.descriptionLocalized ?? [],
      keywords: content?.data.seoMeta?.keywords ?? '',
    },
  };

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormLocalizeSchema(languages)),
    defaultValues,
  });

  const onBackClick = () => {
    navigate({
      pathname: `/${locale}/categories`,
      search: `?${objectToQueryString({
        sidebar: searchParams.get('sidebar'),
        type: searchParams.get('type'),
      })}`,
    });
  };

  const onCreateSuccess = () => {
    toast(t('category_create_toast_title'), { description: t('category_create_success') });
    onBackClick();
  };

  const onCreateFailure = (error: Error) => {
    let errorMessage = t('category_create_failure');

    if (axios.isAxiosError(error) && error.response) {
      errorMessage += `\n${error.response.data.message}`;
    } else {
      errorMessage += `\n${error.message}`;
    }

    toast(t('category_update_toast_title'), { description: errorMessage });
  };

  const onUpdateSuccess = () => {
    toast(t('category_update_toast_title'), { description: t('category_update_success') });
    onBackClick();
  };

  const onUpdateFailure = (error: Error) => {
    let errorMessage = t('category_update_failure');

    if (axios.isAxiosError(error) && error.response) {
      errorMessage += `\n${error.response.data.message}`;
    } else {
      errorMessage += `\n${error.message}`;
    }

    toast(t('category_update_toast_title'), { description: errorMessage });
  };

  const onSubmit: SubmitHandler<CategoryFormData> = async formData => {
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
    <div data-testid="frm-category">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormToolbar className="mb-4" title={t('category_details')} submitDisabled={isFetching} onBackClick={onBackClick} />
          <div className="flex gap-4">
            <Card className="grow">
              <CardContent className="grid gap-4 pt-4">
                <FormFieldInputMultiLanguage
                  form={form}
                  fieldName="nameLocalized"
                  formLabel={t('form_field_name')}
                  minLength={1}
                  maxLength={255}
                  locales={languages}
                />
                <FormFieldInputSlug
                  form={form}
                  fieldName={'slug'}
                  watchFieldName={'nameLocalized.0.value'}
                  formLabel={t('form_field_slug')}
                  minLength={1}
                  maxLength={255}
                  labelDisplay="outside"
                  size="sm"
                  translator={t}
                />
                <FormFieldCKEditorMultiLanguage
                  form={form}
                  fieldName="descriptionLocalized"
                  formLabel={t('form_field_description')}
                  editorRef={editorRef}
                  minHeight={120}
                  minLength={1}
                  maxLength={2000}
                  toolbar={['bold', 'italic', 'underline', 'strikethrough']}
                  locales={languages}
                />
                <FormFieldCKEditorMultiLanguage
                  form={form}
                  fieldName="bodyLocalized"
                  formLabel={t('form_field_content')}
                  editorRef={editorRef}
                  locales={languages}
                  minLength={1}
                  setVisible={setIsFileManagerVisible}
                />
              </CardContent>
              <CardContent className="grid gap-4 pt-4">
                <FormFieldCardSeoMeta form={form} />
              </CardContent>
            </Card>
            <div className="w-72 shrink-0">
              <div className="grid gap-4">
                <FormFieldCardSelectStatus form={form} statuses={CATEGORY_STATUSES} />
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{t('form_field_publish_date')}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <FormFieldInputDatePicker form={form} fieldName="publishDate" size="sm" />
                  </CardContent>
                </Card>
                <FormFieldCardSelectCategory
                  form={form}
                  fieldName="parentId"
                  formLabel={t('form_field_category_parent')}
                  items={categoriesByType?.data ?? []}
                />
                <FormFieldCardCoverMultiLanguage form={form} fieldName="coverLocalized" formLabel="Cover Image" locales={languages} maxVisible={2} />
                <FormFieldCardImages form={form} />
              </div>
            </div>
          </div>
          <Debugger text={JSON.stringify(form.formState.errors, null, 2)} />
          <Debugger text={JSON.stringify(form.watch(), null, 2)} />
        </form>
      </Form>
      <EditorFileDialog editorRef={editorRef} visible={isFileManagerVisible} setVisible={setIsFileManagerVisible} />
      <ModalLoading visible={isFetching || isCategoriesByTypeFetching} />
    </div>
  );
};

export default CategoryForm;
