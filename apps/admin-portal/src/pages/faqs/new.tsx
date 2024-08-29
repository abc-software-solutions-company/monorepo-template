import PageWrapper from '@/components/pages/page-wrapper';

import FaqForm from '@/modules/faqs/components/faq-form';

const PageFaqNew = () => {
  return (
    <PageWrapper>
      <FaqForm isEdit={false} />
    </PageWrapper>
  );
};

export default PageFaqNew;
