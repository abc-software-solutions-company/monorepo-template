import { PageBaseProps } from '@/interfaces/page.interface';

import FormSignIn from '@/modules/auth/components/form-sign-in';

export default async function PageSignIn(_pageProps: PageBaseProps) {
  return (
    <div className="relative grow">
      <FormSignIn />
    </div>
  );
}
