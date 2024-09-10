import { FC, useEffect, useRef, useState } from 'react';
import { Editor } from 'ckeditor5';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useLocale, useTranslations } from 'use-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent } from '~react-web-ui-shadcn/components/ui/card';
import { Form } from '~react-web-ui-shadcn/components/ui/form';
import { objectToQueryString } from '~shared-universal/utils/string.util';

import { PostFormData } from '../interfaces/posts.interface';

import { POST_STATUS, POST_STATUSES } from '../constants/posts.constant';

import usePosts from '../hooks/use-posts';

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

import { usePostsState } from '../states/posts.state';
import { postFormValidator } from '../validators/post-form.validator';

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

  const defaultValues: PostFormData = {
    status: post?.status ?? POST_STATUS.DRAFT,
    name: post?.name ?? '',
    slug: post?.slug ?? '',
    cover: post?.cover ?? '',
    images: post?.images ?? ([] as FileEntity[]),
    description: post?.description ?? '',
    body: post?.body ?? '',
    categoryId: post?.category?.id ?? undefined,
    seoMeta: post?.seoMeta ?? { title: '', description: '', keywords: '' },
  };

  const form = useForm<PostFormData>({ resolver: zodResolver(postFormValidator), defaultValues });

  const onSubmit: SubmitHandler<PostFormData> = async formData => {
    formData.images = formData.images.map(item => ({ id: item.id }) as FileEntity);

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
  }, [form, post, categories]);

  return (
    <div data-testid="frm-post">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormToolbar className="mb-4" title={t('post_details')} submitDisabled={isFetching} onBackClick={onBackClick} />
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
                <FormFieldCardSelectStatus form={form} statuses={POST_STATUSES} />
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

export default PostForm;
