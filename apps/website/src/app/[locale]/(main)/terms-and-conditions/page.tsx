import { PageBaseProps } from '@/interfaces/page.interface';

import PrivacyPolicyApi from '@/modules/contents/api/contents.api';
import TermsAndConditions from '@/modules/contents/components/terms-and-conditions';

export default async function PageTermsAndConditions(_pageProps: PageBaseProps) {
  const response = await PrivacyPolicyApi.getServerContentBySlug('terms-and-conditions');

  return (
    <div className="grow">
      <TermsAndConditions data={response.data} />
    </div>
  );
}
