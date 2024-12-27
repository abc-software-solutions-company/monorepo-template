import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useLocale, useTranslations } from 'use-intl';
import { objectToQueryString } from '~shared-universal/utils/string.util';

import { useCategoriesState } from '../states/categories.state';

function useCategoryToast() {
  const t = useTranslations();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locale = useLocale();
  const categoriesState = useCategoriesState();

  /*****************************************************************
  LIST
  *****************************************************************/
  useEffect(() => {
    if (!categoriesState.isFetching && categoriesState.error) {
      toast(t('category_list_toast_title'), {
        description: t('category_list_failure') + '<br />' + categoriesState.message,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriesState.isFetching, categoriesState.error, categoriesState.message]);

  /*****************************************************************
  CREATE
  *****************************************************************/
  useEffect(() => {
    if (categoriesState.createdAt && !categoriesState.error) {
      toast(t('category_create_toast_title'), {
        description: t('category_create_success'),
      });
      categoriesState.reset();

      navigate({
        pathname: `/${locale}/categories`,
        search: `?${objectToQueryString({ sidebar: searchParams.get('sidebar') })}`,
      });
    }

    if (categoriesState.createdAt && categoriesState.error) {
      toast(t('category_create_toast_title'), {
        description: t('category_create_failure') + '<br />' + categoriesState.message,
      });
      categoriesState.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriesState.createdAt, categoriesState.error, categoriesState.message]);

  /*****************************************************************
  UPDATE
  *****************************************************************/
  useEffect(() => {
    if (categoriesState.updatedAt && !categoriesState.error) {
      toast(t('category_update_toast_title'), {
        description: t('category_update_success'),
      });
      categoriesState.reset();

      navigate({
        pathname: `/${locale}/categories`,
        search: `?${objectToQueryString({ sidebar: searchParams.get('sidebar') })}`,
      });
    }
    if (categoriesState.updatedAt && categoriesState.error) {
      toast(t('category_update_toast_title'), {
        description: t('category_update_failure') + '<br />' + categoriesState.message,
      });
      categoriesState.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriesState.updatedAt, categoriesState.error, categoriesState.message]);

  /*****************************************************************
  DELETE
  *****************************************************************/
  useEffect(() => {
    if (categoriesState.deletedAt && !categoriesState.error) {
      toast(t('category_delete_toast_title'), {
        description: t('category_delete_success'),
      });
      categoriesState.reset();

      navigate({
        pathname: `/${locale}/categories`,
        search: `?${objectToQueryString({ sidebar: searchParams.get('sidebar') })}`,
      });
    }
    if (categoriesState.deletedAt && categoriesState.error) {
      toast(t('category_delete_toast_title'), {
        description: t('category_delete_failure') + '<br />' + categoriesState.message,
      });
      categoriesState.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriesState.deletedAt, categoriesState.error, categoriesState.message]);
}

export default useCategoryToast;
