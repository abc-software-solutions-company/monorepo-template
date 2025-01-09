/*
 * @Author: <Tin Tran> (tin.tran@abcdigital.io)
 * @Created: 2025-01-07 14:58:30
 */

import { ResponseFormat } from '@/interfaces/api-response.interface';
import { BaseFilter } from '@/interfaces/filter.interface';

export type Region = {
  name: string;
  count: number;
  stores: ShopStore[];
};

export type Position = {
  lat: number;
  lng: number;
};

export type ShopStore = {
  id: string;
  name: string;
  address: string;
  phoneNumber: string | null;
  region: string;
  province: string | null;
  position: Position;
  isCenter?: boolean;
};

export type CreateShopStoreDto = Omit<ShopStore, 'id'>;
export type UpdateShopStoreDto = Partial<CreateShopStoreDto>;

export type ShopStoresResponse = ResponseFormat<ShopStore[]>;
export type ShopStoreResponse = ResponseFormat<ShopStore>;

export type ShopStoreFilter = BaseFilter;
