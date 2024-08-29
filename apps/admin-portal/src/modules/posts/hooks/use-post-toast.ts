import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useLocale, useTranslations } from 'use-intl';
import { objectToQueryString } from '~shared-universal/utils/string.util';

import { usePostsState } from '../states/posts.state';

function usePostToast() {
  const t = useTranslations();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locale = useLocale();
  const postsState = usePostsState();

  /*****************************************************************
  LIST
  *****************************************************************/
  useEffect(() => {
    if (!postsState.isFetching && postsState.error) {
      toast(t('post_list_toast_title'), { description: t('post_list_failure') + '<br />' + postsState.message });
    }
  }, [postsState.isFetching, postsState.error]);

  /*****************************************************************
  CREATE
  *****************************************************************/
  useEffect(() => {
    if (postsState.createdAt && !postsState.error) {
      toast(t('post_create_toast_title'), { description: t('post_create_success') });
      postsState.reset();

      navigate({
        pathname: `/${locale}/posts`,
        search: `?${objectToQueryString({ sidebar: searchParams.get('sidebar') })}`,
      });
    }

    if (postsState.createdAt && postsState.error) {
      toast(t('post_create_toast_title'), { description: t('post_create_failure') + '<br />' + postsState.message });
      postsState.reset();
    }
  }, [postsState.createdAt, postsState.error]);

  /*****************************************************************
  UPDATE
  *****************************************************************/
  useEffect(() => {
    if (postsState.updatedAt && !postsState.error) {
      toast(t('post_update_toast_title'), { description: t('post_update_success') });
      postsState.reset();

      navigate({
        pathname: `/${locale}/posts`,
        search: `?${objectToQueryString({ sidebar: searchParams.get('sidebar') })}`,
      });
    }
    if (postsState.updatedAt && postsState.error) {
      toast(t('post_update_toast_title'), { description: t('post_update_failure') + '<br />' + postsState.message });
      postsState.reset();
    }
  }, [postsState.updatedAt, postsState.error]);

  /*****************************************************************
  DELETE
  *****************************************************************/
  useEffect(() => {
    if (postsState.deletedAt && !postsState.error) {
      toast(t('post_delete_toast_title'), { description: t('post_delete_success') });
      postsState.reset();

      navigate({
        pathname: `/${locale}/posts`,
        search: `?${objectToQueryString({ sidebar: searchParams.get('sidebar') })}`,
      });
    }

    if (postsState.deletedAt && postsState.error) {
      toast(t('post_delete_toast_title'), { description: t('post_delete_failure') + '<br />' + postsState.message });
      postsState.reset();
    }
  }, [postsState.deletedAt, postsState.error]);
}

export default usePostToast;
