import PageWrapper from '@/components/pages/page-wrapper';

import PostForm from '@/modules/posts/components/post-form';

const PagePostNew = () => {
  return (
    <PageWrapper>
      <PostForm isEdit={false} />
    </PageWrapper>
  );
};

export default PagePostNew;
