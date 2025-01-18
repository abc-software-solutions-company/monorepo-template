import { CheckCircle2Icon, XCircleIcon } from 'lucide-react';

import { OptionType } from '@/interfaces/status.interface';
import { CategoryFilter } from '../interfaces/categories.interface';

export const QUERY_CATEGORY_LIST = 'categories';
export const QUERY_CATEGORY_DETAIL = 'category';
export const QUERY_CATEGORY_LIST_BY_TYPE = 'categories-by-type';

export enum CATEGORY_STATUS {
  VISIBLED = 'visibled',
  DELETED = 'deleted',
}

export enum CATEGORY_TYPE {
  FILE = 'file',
  PRODUCT = 'product',
  POST = 'post',
}

export enum CATEGORY_ACTION {
  DELETE = 'delete',
  BULK_DELETE = 'bulk_delete',
  AUDIT_LOG = 'audit_log',
}

export const CATEGORY_DEFAULT_FILTER: CategoryFilter = {
  q: '',
  page: 1,
  limit: 50,
  order: 'DESC',
  status: [],
};

export const CATEGORY_TYPES = [
  {
    label: 'File',
    value: CATEGORY_TYPE.FILE,
  },
  {
    label: 'Product',
    value: CATEGORY_TYPE.PRODUCT,
  },
  {
    label: 'Post',
    value: CATEGORY_TYPE.POST,
  },
] as OptionType[];

export const CATEGORY_STATUSES: OptionType[] = [
  {
    label: 'Visibled',
    value: CATEGORY_STATUS.VISIBLED,
    textClassName: 'text-green-500',
    bgClassName: 'bg-green-500/10',
    borderClassName: 'border-green-400',
    activeClassName: 'after:bg-green-400',
    iconClassName: 'text-green-600',
    icon: CheckCircle2Icon,
  },
  {
    label: 'Deleted',
    value: CATEGORY_STATUS.DELETED,
    textClassName: 'text-red-500',
    bgClassName: 'bg-red-500/10',
    borderClassName: 'border-red-400',
    activeClassName: 'after:bg-red-400',
    iconClassName: 'text-red-600',
    icon: XCircleIcon,
  },
];
