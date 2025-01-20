import PageWrapper from '@/components/pages/page-wrapper';

import CategoryList from '@/modules/categories/components/category-list';
import { CategoryProvider } from '@/modules/categories/contexts/categories.context';

const PageCategoryList = () => {
  return (
    <PageWrapper>
      <CategoryProvider>
        <CategoryList />
      </CategoryProvider>
    </PageWrapper>
  );
};

export default PageCategoryList;
