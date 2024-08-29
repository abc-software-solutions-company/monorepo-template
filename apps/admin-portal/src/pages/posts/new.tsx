import PageWrapper from '@/components/pages/page-wrapper';

import PostForm from '@/modules/posts/components/post-form';
import usePostToast from '@/modules/posts/hooks/use-post-toast';

const PagePostNew = () => {
  usePostToast();

  return (
    <PageWrapper>
      <PostForm isEdit={false} />
    </PageWrapper>
  );
};

export default PagePostNew;
