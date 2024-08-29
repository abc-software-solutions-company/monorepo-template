import PageWrapper from '@/components/pages/page-wrapper';

import ProductList from '@/modules/products/components/product-list';
import useProductToast from '@/modules/products/hooks/use-product-toast';

const PageProductList = () => {
  useProductToast();

  return (
    <PageWrapper>
      <ProductList />
    </PageWrapper>
  );
};

export default PageProductList;
