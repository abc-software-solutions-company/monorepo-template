import PageWrapper from '@/components/pages/page-wrapper';

import ProductList from '@/modules/products/components/product-list';
import { ProductProvider } from '@/modules/products/contexts/products.context';

const PageProductList = () => {
  return (
    <PageWrapper>
      <ProductProvider>
        <ProductList />
      </ProductProvider>
    </PageWrapper>
  );
};

export default PageProductList;
