/*
 * @Author: <Tin Tran> (tin.tran@abcdigital.io)
 * @Created: 2025-01-07 17:44:34
 */

import { FC } from 'react';
import { MousePointer2Icon } from 'lucide-react';
import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';

type ShopStorePopupProps = {
  address: string;
  phoneNumber: string | null;
  position: { lat: number; lng: number };
};

const ShopStorePopup: FC<ShopStorePopupProps> = ({ address, phoneNumber, position }) => (
  <div className="mt-1.5 text-slate-800">
    <h3>{address}</h3>
    <p className="my-3">ĐT: {phoneNumber}</p>
    <Button
      type="button"
      variant="outline-primary"
      onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${position.lat},${position.lng}`, '_blank')}
    >
      Chỉ đường
      <MousePointer2Icon className="ml-1 size-4 rotate-90" />
    </Button>
  </div>
);

export default ShopStorePopup;
