import PageWrapper from '@/components/pages/page-wrapper';

import FaqList from '@/modules/faqs/components/faq-list';
import { FaqProvider } from '@/modules/faqs/contexts/faqs.context';

export default function PageFaqsList() {
  return (
    <PageWrapper>
      <FaqProvider>
        <FaqList />
      </FaqProvider>
    </PageWrapper>
  );
}
