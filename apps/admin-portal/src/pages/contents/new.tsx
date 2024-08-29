import PageWrapper from '@/components/pages/page-wrapper';

import ContentForm from '@/modules/contents/components/content-form';

export default function PageContentNew() {
  return (
    <PageWrapper>
      <ContentForm isEdit={false} />
    </PageWrapper>
  );
}
