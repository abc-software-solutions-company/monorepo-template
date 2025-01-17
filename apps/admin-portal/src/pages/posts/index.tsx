import PageWrapper from '@/components/pages/page-wrapper';

import PostList from '@/modules/posts/components/post-list';
import { PostProvider } from '@/modules/posts/contexts/posts.context';

const PagePostList = () => {
  return (
    <PageWrapper>
      <PostProvider>
        <PostList />
      </PostProvider>
    </PageWrapper>
  );
};

export default PagePostList;
