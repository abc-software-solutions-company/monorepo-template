import { Metadata } from 'next';

import { PageBaseProps } from '@/interfaces/page.interface';

import FormSignUp from '@/modules/auth/components/form-sign-up';

export default async function PageSignUp(_pageProps: PageBaseProps) {
  return (
    <div className="relative grow">
      <FormSignUp />
    </div>
  );
}

export async function generateMetadata({ params: { locale } }: PageBaseProps): Promise<Metadata> {
  return {
    title: 'Sign Up',
    description: 'Sign Up Description',
    alternates: {
      canonical: `/${locale}/sign-up`,
    },
  };
}
