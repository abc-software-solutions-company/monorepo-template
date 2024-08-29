import { CheckCircle2Icon, CircleSlashIcon, XCircleIcon } from 'lucide-react';

import { OptionType } from '@/interfaces/status.interface';
import { ContentFilter } from '../interfaces/contents.interface';

export const QUERY_CONTENT_LIST = 'contents';
export const QUERY_CONTENT_DETAIL = 'content';

export enum CONTENT_STATUS {
  PUBLISHED = 'published',
  DRAFT = 'draft',
  DELETED = 'deleted',
}

export enum CONTENT_ACTION {
  DELETE = 'delete',
  BULK_DELETE = 'bulk_delete',
}

export enum CONTENT_TYPE {
  UNCATEGORIZED = 'uncategorized',
}

export const CONTENT_DEFAULT_FILTER: ContentFilter = {
  q: '',
  page: 1,
  limit: 50,
  order: 'DESC',
  status: [],
};

export const CONTENT_STATUSES: OptionType[] = [
  {
    label: 'Published',
    value: CONTENT_STATUS.PUBLISHED,
    textClassName: 'text-green-500',
    bgClassName: 'bg-green-500/10',
    borderClassName: 'border-green-400',
    activeClassName: 'after:bg-green-400',
    iconClassName: 'text-green-600',
    icon: CheckCircle2Icon,
  },
  {
    label: 'Draft',
    value: CONTENT_STATUS.DRAFT,
    textClassName: 'text-amber-500',
    bgClassName: 'bg-amber-500/10',
    borderClassName: 'border-amber-400',
    activeClassName: 'after:bg-amber-400',
    iconClassName: 'text-amber-600',
    icon: CircleSlashIcon,
  },
  {
    label: 'Deleted',
    value: CONTENT_STATUS.DELETED,
    textClassName: 'text-red-500',
    bgClassName: 'bg-red-500/10',
    borderClassName: 'border-red-400',
    activeClassName: 'after:bg-red-400',
    iconClassName: 'text-red-600',
    icon: XCircleIcon,
  },
];
