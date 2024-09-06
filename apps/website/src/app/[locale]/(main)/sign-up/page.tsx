import { PageBaseProps } from '@/interfaces/page.interface';

import FormSignUp from '@/modules/auth/components/form-sign-up';

export default async function PageSignUp(_pageProps: PageBaseProps) {
  return (
    <div className="relative grow">
      <FormSignUp />
    </div>
  );
}
