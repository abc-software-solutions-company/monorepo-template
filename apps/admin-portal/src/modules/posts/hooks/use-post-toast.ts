import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useLocale, useTranslations } from 'use-intl';
import { objectToQueryString } from '@repo/shared-universal/utils/string.util';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postsState.isFetching, postsState.error, postsState.message]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postsState.createdAt, postsState.error, postsState.message]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postsState.updatedAt, postsState.error, postsState.message]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postsState.deletedAt, postsState.error, postsState.message]);
}

export default usePostToast;
