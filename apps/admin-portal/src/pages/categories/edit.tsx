import PageWrapper from '@/components/pages/page-wrapper';

import CategoryForm from '@/modules/categories/components/category-form';

const PageCategoryEdit = () => {
  return (
    <PageWrapper>
      <CategoryForm isEdit={true} />
    </PageWrapper>
  );
};

export default PageCategoryEdit;
