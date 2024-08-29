import PageWrapper from '@/components/pages/page-wrapper';

import ContentList from '@/modules/contents/components/content-list';
import { ContentProvider } from '@/modules/contents/contexts/contents.context';

export default function PageContentList() {
  return (
    <PageWrapper>
      <ContentProvider>
        <ContentList />
      </ContentProvider>
    </PageWrapper>
  );
}
