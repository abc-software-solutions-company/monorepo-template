import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useLocale, useTranslations } from 'use-intl';
import { objectToQueryString } from '~shared-universal/utils/string.util';

import { useUsersState } from '../states/users.state';

function useUserToast() {
  const t = useTranslations();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locale = useLocale();
  const usersState = useUsersState();

  /*****************************************************************
  LIST
  *****************************************************************/
  useEffect(() => {
    if (!usersState.isFetching && usersState.error) {
      toast(t('user_list_toast_title'), { description: t('user_list_failure') + '<br />' + usersState.message });
    }
  }, [usersState.isFetching, usersState.error]);

  /*****************************************************************
  CREATE
  *****************************************************************/
  useEffect(() => {
    if (usersState.createdAt && !usersState.error) {
      toast(t('user_create_toast_title'), { description: t('user_create_success') });
      usersState.reset();

      navigate({
        pathname: `/${locale}/users`,
        search: `?${objectToQueryString({ sidebar: searchParams.get('sidebar') })}`,
      });
    }

    if (usersState.createdAt && usersState.error) {
      toast(t('user_create_toast_title'), { description: t('user_create_failure') + '<br />' + usersState.message });
      usersState.reset();
    }
  }, [usersState.createdAt, usersState.error]);

  /*****************************************************************
  UPDATE
  *****************************************************************/
  useEffect(() => {
    if (usersState.updatedAt && !usersState.error) {
      toast(t('user_update_toast_title'), { description: t('user_update_success') });
      usersState.reset();

      navigate({
        pathname: `/${locale}/users`,
        search: `?${objectToQueryString({ sidebar: searchParams.get('sidebar') })}`,
      });
    }
    if (usersState.updatedAt && usersState.error) {
      toast(t('user_update_toast_title'), { description: t('user_update_failure') + '<br />' + usersState.message });
      usersState.reset();
    }
  }, [usersState.updatedAt, usersState.error]);

  /*****************************************************************
  DELETE
  *****************************************************************/
  useEffect(() => {
    if (usersState.deletedAt && !usersState.error) {
      toast(t('user_delete_toast_title'), { description: t('user_delete_success') });
      usersState.reset();

      navigate({
        pathname: `/${locale}/users`,
        search: `?${objectToQueryString({ sidebar: searchParams.get('sidebar') })}`,
      });
    }
    if (usersState.deletedAt && usersState.error) {
      toast(t('user_delete_toast_title'), { description: t('user_delete_failure') + '<br />' + usersState.message });
      usersState.reset();
    }
  }, [usersState.deletedAt, usersState.error]);
}

export default useUserToast;
