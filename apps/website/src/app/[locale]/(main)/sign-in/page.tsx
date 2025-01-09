import { Metadata } from 'next';

import { PageBaseProps } from '@/interfaces/page.interface';

import FormSignIn from '@/modules/auth/components/form-sign-in';

export default async function PageSignIn(_pageProps: PageBaseProps) {
  return (
    <div className="relative grow">
      <FormSignIn />
    </div>
  );
}

export async function generateMetadata({ params: { locale } }: PageBaseProps): Promise<Metadata> {
  return {
    title: 'Sign In',
    description: 'Sign In Description',
    alternates: {
      canonical: `/${locale}/sign-in`,
    },
  };
}
