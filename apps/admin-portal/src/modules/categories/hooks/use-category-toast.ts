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
  }, [categoriesState.isFetching, categoriesState.error]);

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
  }, [categoriesState.createdAt, categoriesState.error]);

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
  }, [categoriesState.updatedAt, categoriesState.error]);

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
  }, [categoriesState.deletedAt, categoriesState.error]);
}

export default useCategoryToast;
