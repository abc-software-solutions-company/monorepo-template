import { PageBaseProps } from '@/interfaces/page.interface';

import HomeRoot from '@/modules/home/components/home-root';
import ShopStoreRoot from '@/modules/shop-stores/components/shop-store.root';

export default async function HomePage(_pageProps: PageBaseProps) {
  return (
    <div className="grow">
      <ShopStoreRoot />
      <HomeRoot />
    </div>
  );
}
