import { PageBaseProps } from '@/interfaces/page.interface';

import HomeRoot from '@/modules/home/components/home-root';

export default async function HomePage(_pageProps: PageBaseProps) {
  return (
    <div className="grow">
      <HomeRoot />
    </div>
  );
}
