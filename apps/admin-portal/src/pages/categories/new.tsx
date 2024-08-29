import PageWrapper from '@/components/pages/page-wrapper';

import CategoryForm from '@/modules/categories/components/category-form';
import useCategoryToast from '@/modules/categories/hooks/use-category-toast';

const PageCategoryNew = () => {
  useCategoryToast();

  return (
    <PageWrapper>
      <CategoryForm isEdit={false} />
    </PageWrapper>
  );
};

export default PageCategoryNew;
