import PageWrapper from '@/components/pages/page-wrapper';

import FaqForm from '@/modules/faqs/components/faq-form';

const PageFaqEdit = () => {
  return (
    <PageWrapper>
      <FaqForm isEdit={true} />
    </PageWrapper>
  );
};

export default PageFaqEdit;
