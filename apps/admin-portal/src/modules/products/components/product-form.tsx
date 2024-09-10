import { FC, useEffect, useRef, useState } from 'react';
import { Editor } from 'ckeditor5';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useLocale, useTranslations } from 'use-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent } from '~react-web-ui-shadcn/components/ui/card';
import { Form } from '~react-web-ui-shadcn/components/ui/form';
import { objectToQueryString } from '~shared-universal/utils/string.util';

import { ProductFormData } from '../interfaces/products.interface';

import { PRODUCT_STATUS, PRODUCT_STATUSES } from '../constants/products.constant';

import useProducts from '../hooks/use-products';

import EditorFileDialog from '@/components/editors/editor-file-dialog';
import FormFieldCardCover from '@/components/form-fields/form-field-card-cover';
import FormFieldCardImages from '@/components/form-fields/form-field-card-images';
import FormFieldCardSelectCategory from '@/components/form-fields/form-field-card-select-category';
import FormFieldCardSelectStatus from '@/components/form-fields/form-field-card-select-status';
import FormFieldCardSeoMeta from '@/components/form-fields/form-field-card-seo-meta';
import FormFieldCKEditorFull from '@/components/form-fields/form-field-ckeditor-full';
import FormFieldCKEditorSimple from '@/components/form-fields/form-field-ckeditor-simple';
import FormFieldInputName from '@/components/form-fields/form-field-input-name';
import FormFieldInputSlug from '@/components/form-fields/form-field-input-slug';
import FormToolbar from '@/components/form-toolbar';
import ModalLoading from '@/components/modals/modal-loading';

import { FileEntity } from '@/modules/files/interfaces/files.interface';

import { useProductsState } from '../states/products.state';
import { productFormValidator } from '../validators/product-form.validator';

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

  const defaultValues: ProductFormData = {
    status: product?.status ?? PRODUCT_STATUS.DRAFT,
    name: product?.name ?? '',
    slug: product?.slug ?? '',
    cover: product?.cover ?? '',
    images: product?.images ?? ([] as FileEntity[]),
    description: product?.description ?? '',
    body: product?.body ?? '',
    categoryId: product?.category?.id ?? undefined,
    seoMeta: product?.seoMeta ?? { title: '', description: '', keywords: '' },
  };

  const form = useForm<ProductFormData>({ resolver: zodResolver(productFormValidator), defaultValues });

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
  }, [form, product, categories]);

  return (
    <div data-testid="frm-product">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormToolbar className="mb-4" title={t('product_details')} submitDisabled={isFetching} onBackClick={onBackClick} />
          <div className="flex gap-4">
            <Card className="grow">
              <CardContent className="grid gap-4 pt-4">
                <FormFieldInputName form={form} />
                <FormFieldInputSlug form={form} />
                <FormFieldCKEditorSimple form={form} editorRef={editorRef} setVisible={setIsFileManagerVisible} />
                <FormFieldCKEditorFull form={form} editorRef={editorRef} setVisible={setIsFileManagerVisible} />
              </CardContent>
              <CardContent className="grid gap-4 pt-4">
                <FormFieldCardSeoMeta form={form} />
              </CardContent>
            </Card>
            <div className="w-72 shrink-0">
              <div className="grid gap-4">
                <FormFieldCardSelectStatus form={form} statuses={PRODUCT_STATUSES} />
                <FormFieldCardSelectCategory form={form} categories={categories ?? []} />
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

export default ProductForm;
