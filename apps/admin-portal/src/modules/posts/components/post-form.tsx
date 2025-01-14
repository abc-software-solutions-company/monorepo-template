import { FC, useEffect, useRef, useState } from 'react';
import { Editor } from 'ckeditor5';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useLocale, useTranslations } from 'use-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import Debugger from '@repo/react-web-ui-shadcn/components/debugger';
import FormFieldInputSlug from '@repo/react-web-ui-shadcn/components/form-fields/form-field-input-slug';
import FormFieldCKEditorMultiLanguage from '@repo/react-web-ui-shadcn/components/form-fields-ahua/form-field-ckeditor-multi-language';
import FormFieldInputMultiLanguage from '@repo/react-web-ui-shadcn/components/form-fields-ahua/form-field-input-multi-language';
import ModalLoading from '@repo/react-web-ui-shadcn/components/modals/modal-loading';
import { Card, CardContent } from '@repo/react-web-ui-shadcn/components/ui/card';
import { Form } from '@repo/react-web-ui-shadcn/components/ui/form';
import { LANGUAGES } from '@repo/shared-universal/constants/language.constant';
import { getLanguages } from '@repo/shared-universal/utils/language.util';
import { objectToQueryString } from '@repo/shared-universal/utils/string.util';

import { PostFormData } from '../interfaces/posts.interface';

import { POST_STATUS, POST_STATUSES } from '../constants/posts.constant';

import usePosts from '../hooks/use-posts';

import EditorFileDialog from '@/components/editor-file-dialog';
import FormFieldCardCoverMultiLanguage from '@/components/form-fields/form-field-card-cover-multi-language';
import FormFieldCardImages from '@/components/form-fields/form-field-card-images';
import FormFieldCardSelectCategory from '@/components/form-fields/form-field-card-select-category';
import FormFieldCardSelectStatus from '@/components/form-fields/form-field-card-select-status';
import FormFieldCardSeoMeta from '@/components/form-fields/form-field-card-seo-meta';
import FormToolbar from '@/components/form-toolbar';

import { FileEntity } from '@/modules/files/interfaces/files.interface';

import { usePostsState } from '../states/posts.state';
import { postFormLocalizeSchema } from '../validators/post-form.validator';

type PostFormProps = {
  isEdit: boolean;
};

const PostForm: FC<PostFormProps> = ({ isEdit }) => {
  const t = useTranslations();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = useParams();
  const locale = useLocale();
  const editorRef = useRef<Editor | null>(null);
  const [isFileManagerVisible, setIsFileManagerVisible] = useState(false);
  const postsState = usePostsState();
  const { post, categories, isFetching } = usePosts({ isEdit, postId: params.id as string });

  const languages = getLanguages(locale);

  const defaultValues: PostFormData = {
    status: post?.status ?? POST_STATUS.DRAFT,
    name: post?.name ?? '',
    slug: post?.slug ?? '',
    cover: post?.cover ?? '',
    coverLocalized: post?.coverLocalized ?? [],
    images: post?.images ?? ([] as FileEntity[]),
    description: post?.description ?? '',
    body: post?.body ?? '',
    categoryId: post?.category?.id ?? undefined,
    nameLocalized: post?.nameLocalized ?? [],
    descriptionLocalized: post?.descriptionLocalized ?? [],
    bodyLocalized: post?.bodyLocalized ?? [],
    seoMeta: {
      // TODO: Will be removed
      title: post?.seoMeta?.title ?? '',
      // TODO: Will be removed
      description: post?.seoMeta?.description ?? '',
      titleLocalized: post?.seoMeta?.titleLocalized ?? [],
      descriptionLocalized: post?.seoMeta?.descriptionLocalized ?? [],
      keywords: post?.seoMeta?.keywords ?? '',
    },
  };

  const form = useForm<PostFormData>({
    resolver: zodResolver(postFormLocalizeSchema(LANGUAGES)),
    defaultValues,
  });

  const onSubmit: SubmitHandler<PostFormData> = async formData => {
    formData.images = formData.images.map(item => ({ id: item.id }));

    if (isEdit) {
      postsState.updateRequest({ id: params.id as string, data: formData });
    } else {
      postsState.createRequest(formData);
    }
  };

  const onBackClick = () => {
    navigate({
      pathname: `/${locale}/posts`,
      search: `?${objectToQueryString({ sidebar: searchParams.get('sidebar') })}`,
    });
  };

  useEffect(() => {
    form.reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, post, categories]);

  return (
    <div data-testid="frm-post">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormToolbar className="mb-4" title={t('post_details')} submitDisabled={isFetching} onBackClick={onBackClick} />
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
                <FormFieldInputSlug form={form} />
                <FormFieldCKEditorMultiLanguage
                  form={form}
                  fieldName="descriptionLocalized"
                  formLabel={t('form_field_description')}
                  editorRef={editorRef}
                  minHeight={120}
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
                  maxLength={50000}
                  setVisible={setIsFileManagerVisible}
                />
              </CardContent>
              <CardContent className="grid gap-4 pt-4">
                <FormFieldCardSeoMeta form={form} />
              </CardContent>
            </Card>
            <div className="w-72 shrink-0">
              <div className="grid gap-4">
                <FormFieldCardSelectStatus form={form} statuses={POST_STATUSES} />
                <FormFieldCardSelectCategory form={form} categories={categories ?? []} />
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
      <ModalLoading visible={isFetching} />
    </div>
  );
};

export default PostForm;
