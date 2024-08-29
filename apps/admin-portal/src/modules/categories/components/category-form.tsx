import { FC, useEffect, useRef, useState } from 'react';
import { Editor } from 'ckeditor5';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useLocale, useTranslations } from 'use-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent } from '~react-web-ui-shadcn/components/ui/card';
import { Form } from '~react-web-ui-shadcn/components/ui/form';
import { objectToQueryString } from '~shared-universal/utils/string.util';

import { CategoryFormData } from '../interfaces/categories.interface';

import { CATEGORY_STATUS, CATEGORY_STATUSES, CATEGORY_TYPE, CATEGORY_TYPES } from '../constants/categories.constant';

import useCategories from '../hooks/use-categories';

import EditorFileDialog from '@/components/editors/editor-file-dialog';
import FormFieldCardCover from '@/components/form-fields/form-field-card-cover';
import FormFieldCardImages from '@/components/form-fields/form-field-card-images';
import FormFieldCardSelectCategory from '@/components/form-fields/form-field-card-select-category';
import FormFieldCardSelectCategoryType from '@/components/form-fields/form-field-card-select-category-type';
import FormFieldCardSelectStatus from '@/components/form-fields/form-field-card-select-status';
import FormFieldCKEditorFull from '@/components/form-fields/form-field-ckeditor-full';
import FormFieldCKEditorSimple from '@/components/form-fields/form-field-ckeditor-simple';
import FormFieldInputName from '@/components/form-fields/form-field-input-name';
import FormFieldInputSlug from '@/components/form-fields/form-field-input-slug';
import FormToolbar from '@/components/form-toolbar';
import ModalLoading from '@/components/modals/modal-loading';

import { FileEntity } from '@/modules/files/interfaces/files.interface';

import { useCategoriesState } from '../states/categories.state';
import { categoryFormValidator } from '../validators/category-form.validator';

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
  const categoriesState = useCategoriesState();
  const { category, categories, isFetching, refetchCategories } = useCategories({
    isEdit,
    categoryId: params.id as string,
  });

  const defaultValues: CategoryFormData = {
    status: category?.status ?? CATEGORY_STATUS.VISIBLED,
    name: category?.name ?? '',
    slug: category?.slug ?? '',
    cover: category?.cover ?? '',
    images: category?.images ?? ([] as FileEntity[]),
    description: category?.description ?? '',
    body: category?.body ?? '',
    type: category?.type ?? ('' as CATEGORY_TYPE),
    parentId: category?.parent?.id ?? undefined,
  };

  const form = useForm<CategoryFormData>({ resolver: zodResolver(categoryFormValidator), defaultValues });

  const onSubmit: SubmitHandler<CategoryFormData> = async formData => {
    if (isEdit) {
      categoriesState.updateRequest({ id: params.id as string, data: formData });
    } else {
      categoriesState.createRequest(formData);
    }
  };

  const onBackClick = () => {
    navigate({
      pathname: `/${locale}/categories`,
      search: `?${objectToQueryString({ sidebar: searchParams.get('sidebar') })}`,
    });
  };

  useEffect(() => {
    if (category) {
      form.reset(defaultValues);
    }
  }, [form, category, categories]);

  return (
    <div data-testid="frm-category">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormToolbar className="mb-4" title={t('category_details')} submitDisabled={isFetching} onBackClick={onBackClick} />
          <div className="flex gap-4">
            <Card className="grow">
              <CardContent className="grid gap-4 pt-4">
                <FormFieldInputName form={form} />
                <FormFieldInputSlug form={form} />
                <FormFieldCKEditorSimple form={form} editorRef={editorRef} setVisible={setIsFileManagerVisible} />
                <FormFieldCKEditorFull form={form} editorRef={editorRef} setVisible={setIsFileManagerVisible} />
              </CardContent>
            </Card>
            <div className="w-72 shrink-0">
              <div className="grid gap-4">
                <FormFieldCardSelectStatus form={form} statuses={CATEGORY_STATUSES} />
                {!category && (
                  <FormFieldCardSelectCategoryType
                    form={form}
                    items={CATEGORY_TYPES}
                    onChange={value => refetchCategories({ type: value as CATEGORY_TYPE })}
                  />
                )}
                <FormFieldCardSelectCategory
                  form={form}
                  formLabel={t('form_field_category_parent')}
                  fieldName={'parentId'}
                  categories={categories ?? []}
                />
                <FormFieldCardCover form={form} />
                <FormFieldCardImages form={form} />
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

export default CategoryForm;
