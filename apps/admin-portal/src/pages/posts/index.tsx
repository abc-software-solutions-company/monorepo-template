import PageWrapper from '@/components/pages/page-wrapper';

import PostList from '@/modules/posts/components/post-list';
import usePostToast from '@/modules/posts/hooks/use-post-toast';

const PagePostList = () => {
  usePostToast();

  return (
    <PageWrapper>
      <PostList />
    </PageWrapper>
  );
};

export default PagePostList;
