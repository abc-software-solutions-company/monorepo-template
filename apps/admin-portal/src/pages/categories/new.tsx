import PageWrapper from '@/components/pages/page-wrapper';

import CategoryForm from '@/modules/categories/components/category-form';

const PageCategoryNew = () => {
  return (
    <PageWrapper>
      <CategoryForm isEdit={false} />
    </PageWrapper>
  );
};

export default PageCategoryNew;
