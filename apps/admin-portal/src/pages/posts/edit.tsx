import PageWrapper from '@/components/pages/page-wrapper';

import PostForm from '@/modules/posts/components/post-form';

const PagePostEdit = () => {
  return (
    <PageWrapper>
      <PostForm isEdit={true} />
    </PageWrapper>
  );
};

export default PagePostEdit;
