import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useLocale, useTranslations } from 'use-intl';
import { objectToQueryString } from '~shared-universal/utils/string.util';

import { useProductsState } from '../states/products.state';

function useProductToast() {
  const t = useTranslations();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locale = useLocale();
  const productsState = useProductsState();

  /*****************************************************************
  LIST
  *****************************************************************/
  useEffect(() => {
    if (!productsState.isFetching && productsState.error) {
      toast(t('product_list_toast_title'), {
        description: t('product_list_failure') + '<br />' + productsState.message,
      });
    }
  }, [productsState.isFetching, productsState.error]);

  /*****************************************************************
  CREATE
  *****************************************************************/
  useEffect(() => {
    if (productsState.createdAt && !productsState.error) {
      toast(t('product_create_toast_title'), { description: t('product_create_success') });
      productsState.reset();

      navigate({
        pathname: `/${locale}/products`,
        search: `?${objectToQueryString({ sidebar: searchParams.get('sidebar') })}`,
      });
    }

    if (productsState.createdAt && productsState.error) {
      toast(t('product_create_toast_title'), {
        description: t('product_create_failure') + '<br />' + productsState.message,
      });
      productsState.reset();
    }
  }, [productsState.createdAt, productsState.error]);

  /*****************************************************************
  UPDATE
  *****************************************************************/
  useEffect(() => {
    if (productsState.updatedAt && !productsState.error) {
      toast(t('product_update_toast_title'), { description: t('product_update_success') });
      productsState.reset();

      navigate({
        pathname: `/${locale}/products`,
        search: `?${objectToQueryString({ sidebar: searchParams.get('sidebar') })}`,
      });
    }
    if (productsState.updatedAt && productsState.error) {
      toast(t('product_update_toast_title'), {
        description: t('product_update_failure') + '<br />' + productsState.message,
      });
      productsState.reset();
    }
  }, [productsState.updatedAt, productsState.error]);

  /*****************************************************************
  DELETE
  *****************************************************************/
  useEffect(() => {
    if (productsState.deletedAt && !productsState.error) {
      toast(t('product_delete_toast_title'), { description: t('product_delete_success') });
      productsState.reset();

      navigate({
        pathname: `/${locale}/products`,
        search: `?${objectToQueryString({ sidebar: searchParams.get('sidebar') })}`,
      });
    }
    if (productsState.deletedAt && productsState.error) {
      toast(t('product_delete_toast_title'), {
        description: t('product_delete_failure') + '<br />' + productsState.message,
      });
      productsState.reset();
    }
  }, [productsState.deletedAt, productsState.error]);
}

export default useProductToast;
