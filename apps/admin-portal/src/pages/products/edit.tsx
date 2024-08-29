import PageWrapper from '@/components/pages/page-wrapper';

import ProductForm from '@/modules/products/components/product-form';
import useProductToast from '@/modules/products/hooks/use-product-toast';

const PageProductEdit = () => {
  useProductToast();

  return (
    <PageWrapper>
      <ProductForm isEdit={true} />
    </PageWrapper>
  );
};

export default PageProductEdit;
