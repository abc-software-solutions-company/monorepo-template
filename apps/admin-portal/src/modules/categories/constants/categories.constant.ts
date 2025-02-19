import { CheckCircle2Icon, CircleSlashIcon, XCircleIcon } from 'lucide-react';

import { OptionType } from '@/interfaces/status.interface';
import { CategoryFilter } from '../interfaces/categories.interface';

export const QUERY_CATEGORY_LIST = 'categories';
export const QUERY_CATEGORY_DETAIL = 'category';
export const QUERY_CATEGORY_LIST_BY_TYPE = 'categories-by-type';

export enum CATEGORY_STATUS {
  PUBLISHED = 'published',
  DRAFT = 'draft',
  DELETED = 'deleted',
}

// Combine POST_TYPE and PRODUCT_TYPE
export enum CATEGORY_TYPE {
  NEWS = 'news',
  PAGE = 'page',
  PRODUCT = 'product',
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
  type: CATEGORY_TYPE.NEWS,
};

export const CATEGORY_TYPES = [
  {
    label: 'Product',
    value: CATEGORY_TYPE.PRODUCT,
  },
  {
    label: 'News',
    value: CATEGORY_TYPE.NEWS,
  },
  {
    label: 'Page',
    value: CATEGORY_TYPE.PAGE,
  },
] as OptionType[];

export const CATEGORY_STATUSES: OptionType[] = [
  {
    label: 'Published',
    value: CATEGORY_STATUS.PUBLISHED,
    textClassName: 'text-green-500',
    bgClassName: 'bg-green-500/10',
    borderClassName: 'border-green-400',
    activeClassName: 'after:bg-green-400',
    iconClassName: 'text-green-600',
    icon: CheckCircle2Icon,
  },
  {
    label: 'Draft',
    value: CATEGORY_STATUS.DRAFT,
    textClassName: 'text-amber-500',
    bgClassName: 'bg-amber-500/10',
    borderClassName: 'border-amber-400',
    activeClassName: 'after:bg-amber-400',
    iconClassName: 'text-amber-600',
    icon: CircleSlashIcon,
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
