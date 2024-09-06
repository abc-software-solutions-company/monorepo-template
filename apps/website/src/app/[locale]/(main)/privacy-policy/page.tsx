import { PageBaseProps } from '@/interfaces/page.interface';

import PrivacyPolicyApi from '@/modules/contents/api/contents.api';
import PrivacyPolicy from '@/modules/contents/components/privacy-policy';

export default async function PagePrivacyPolicy(_pageProps: PageBaseProps) {
  const response = await PrivacyPolicyApi.getServerContentBySlug('privacy-policy');

  return (
    <div className="grow">
      <PrivacyPolicy data={response.data} />
    </div>
  );
}
