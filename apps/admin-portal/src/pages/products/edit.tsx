import PageWrapper from '@/components/pages/page-wrapper';

import ProductForm from '@/modules/products/components/product-form';

const PageProductEdit = () => {
  return (
    <PageWrapper>
      <ProductForm isEdit={true} />
    </PageWrapper>
  );
};

export default PageProductEdit;
