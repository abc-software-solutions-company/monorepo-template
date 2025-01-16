import { FC, useEffect, useRef, useState } from 'react';
import { Editor } from 'ckeditor5';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useLocale, useTranslations } from 'use-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import FormFieldCKEditor from '@repo/react-web-ui-shadcn/components/form-fields/form-field-ckeditor';
import FormFieldInput from '@repo/react-web-ui-shadcn/components/form-fields/form-field-input';
import FormFieldInputSlug from '@repo/react-web-ui-shadcn/components/form-fields/form-field-input-slug';
import FormFieldCKEditorMultiLanguage from '@repo/react-web-ui-shadcn/components/form-fields-ahua/form-field-ckeditor-multi-language';
import FormFieldInputMultiLanguage from '@repo/react-web-ui-shadcn/components/form-fields-ahua/form-field-input-multi-language';
import ModalLoading from '@repo/react-web-ui-shadcn/components/modals/modal-loading';
import { Card, CardContent } from '@repo/react-web-ui-shadcn/components/ui/card';
import { Form } from '@repo/react-web-ui-shadcn/components/ui/form';
import { getLanguages } from '@repo/shared-universal/utils/language.util';
import { objectToQueryString } from '@repo/shared-universal/utils/string.util';

import { ProductFormData } from '../interfaces/products.interface';

import { PRODUCT_STATUS, PRODUCT_STATUSES } from '../constants/products.constant';

import useProducts from '../hooks/use-products';

import EditorFileDialog from '@/components/editor-file-dialog';
import FormFieldCardCover from '@/components/form-fields/form-field-card-cover';
import FormFieldCardCoverMultiLanguage from '@/components/form-fields/form-field-card-cover-multi-language';
import FormFieldCardImages from '@/components/form-fields/form-field-card-images';
import FormFieldCardSelectCategory from '@/components/form-fields/form-field-card-select-category';
import FormFieldCardSelectStatus from '@/components/form-fields/form-field-card-select-status';
import FormFieldCardSeoMeta from '@/components/form-fields/form-field-card-seo-meta';
import FormToolbar from '@/components/form-toolbar';

import { FileEntity } from '@/modules/files/interfaces/files.interface';

import { useProductsState } from '../states/products.state';
import { productFormLocalizeSchema } from '../validators/product-form.validator';

type ProductFormProps = {
  isEdit: boolean;
};

const ProductForm: FC<ProductFormProps> = ({ isEdit }) => {
  const t = useTranslations();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = useParams();
  const locale = useLocale();
  const editorRef = useRef<Editor | null>(null);
  const [isFileManagerVisible, setIsFileManagerVisible] = useState(false);
  const productsState = useProductsState();
  const { product, categories, isFetching } = useProducts({ isEdit, productId: params.id as string });

  const languages = getLanguages(locale);

  const defaultValues: ProductFormData = {
    status: product?.status ?? PRODUCT_STATUS.DRAFT,
    name: product?.name ?? '',
    slug: product?.slug ?? '',
    cover: product?.cover ?? '',
    images: product?.images ?? ([] as FileEntity[]),
    description: product?.description ?? '',
    body: product?.body ?? '',
    categoryId: product?.category?.id ?? undefined,
    nameLocalized: product?.nameLocalized ?? [],
    descriptionLocalized: product?.descriptionLocalized ?? [],
    bodyLocalized: product?.bodyLocalized ?? [],
    coverLocalized: product?.coverLocalized ?? [],
    seoMeta: {
      // TODO: Will be removed
      title: product?.seoMeta?.title ?? '',
      // TODO: Will be removed
      description: product?.seoMeta?.description ?? '',
      titleLocalized: product?.seoMeta?.titleLocalized ?? [],
      descriptionLocalized: product?.seoMeta?.descriptionLocalized ?? [],
      keywords: product?.seoMeta?.keywords ?? '',
    },
  };

  const form = useForm<ProductFormData>({ resolver: zodResolver(productFormLocalizeSchema(languages)), defaultValues });

  const onSubmit: SubmitHandler<ProductFormData> = async formData => {
    formData.images = formData.images.map(item => ({ id: item.id }) as FileEntity);

    if (isEdit) {
      productsState.updateRequest({ id: params.id as string, data: formData });
    } else {
      productsState.createRequest(formData);
    }
  };

  const onBackClick = () => {
    navigate({
      pathname: `/${locale}/products`,
      search: `?${objectToQueryString({ sidebar: searchParams.get('sidebar') })}`,
    });
  };

  useEffect(() => {
    form.reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, product]);

  return (
    <div data-testid="frm-product">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormToolbar className="mb-4" title={t('product_details')} submitDisabled={isFetching} onBackClick={onBackClick} />
          <div className="flex gap-4">
            <Card className="grow">
              <CardContent className="grid gap-4 pt-4">
                <FormFieldInputMultiLanguage locales={languages} form={form} fieldName="nameLocalized" formLabel={t('form_field_name')} />
                <FormFieldInputSlug form={form} />
                <FormFieldCKEditorMultiLanguage
                  form={form}
                  locales={languages}
                  fieldName="descriptionLocalized"
                  formLabel={t('form_field_description')}
                  editorRef={editorRef}
                  minHeight={120}
                  toolbar={['bold', 'italic', 'underline', 'strikethrough']}
                />
                <FormFieldCKEditorMultiLanguage
                  form={form}
                  locales={languages}
                  fieldName="bodyLocalized"
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
                <FormFieldCardSelectStatus form={form} statuses={PRODUCT_STATUSES} />
                <FormFieldCardSelectCategory form={form} categories={categories ?? []} />
                <FormFieldCardCoverMultiLanguage locales={languages} fieldName="coverLocalized" form={form} maxVisible={2} />
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

export default ProductForm;
