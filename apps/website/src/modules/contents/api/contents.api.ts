import { ContentResponse } from '../interfaces/contents.interface';

import { API_ENDPOINTS } from '@/constants/api-endpoint.constant';

export async function getServerContentBySlug(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINTS.CONTENTS}/.by.slug/${slug}`, {
    next: { revalidate: 60 },
  });
  const json = await res.json();

  return json as ContentResponse;
}

const PrivacyPolicyApi = { getServerContentBySlug };

export default PrivacyPolicyApi;
