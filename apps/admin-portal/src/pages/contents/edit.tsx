import PageWrapper from '@/components/pages/page-wrapper';

import ContentForm from '@/modules/contents/components/content-form';

export default function PageContentEdit() {
  return (
    <PageWrapper>
      <ContentForm isEdit={true} />
    </PageWrapper>
  );
}
