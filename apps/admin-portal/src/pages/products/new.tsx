import PageWrapper from '@/components/pages/page-wrapper';

import ProductForm from '@/modules/products/components/product-form';

const PageProductNew = () => {
  return (
    <PageWrapper>
      <ProductForm isEdit={false} />
    </PageWrapper>
  );
};

export default PageProductNew;
