import PageWrapper from '@/components/pages/page-wrapper';

import CategoryList from '@/modules/categories/components/category-list';
import useCategoryToast from '@/modules/categories/hooks/use-category-toast';

const PageCategoryList = () => {
  useCategoryToast();

  return (
    <PageWrapper>
      <CategoryList />
    </PageWrapper>
  );
};

export default PageCategoryList;
