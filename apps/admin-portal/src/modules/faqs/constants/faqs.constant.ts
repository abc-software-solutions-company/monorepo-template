import { CheckCircle2Icon, CircleSlashIcon, XCircleIcon } from 'lucide-react';

import { OptionType } from '@/interfaces/status.interface';
import { FaqFilter } from '../interfaces/faqs.interface';

export const QUERY_FAQ_LIST = 'faqs';
export const QUERY_FAQ_DETAIL = 'faq';

export enum FAQ_STATUS {
  PUBLISHED = 'published',
  DRAFT = 'draft',
  DELETED = 'deleted',
}

export enum FAQ_ACTION {
  DELETE = 'delete',
  BULK_DELETE = 'bulk_delete',
}

export const FAQ_DEFAULT_FILTER: FaqFilter = {
  q: '',
  page: 1,
  limit: 50,
  order: 'DESC',
  status: [],
};

export const FAQ_STATUSES: OptionType[] = [
  {
    label: 'Published',
    value: FAQ_STATUS.PUBLISHED,
    textClassName: 'text-green-500',
    bgClassName: 'bg-green-500/10',
    borderClassName: 'border-green-400',
    activeClassName: 'after:bg-green-400',
    iconClassName: 'text-green-600',
    icon: CheckCircle2Icon,
  },
  {
    label: 'Draft',
    value: FAQ_STATUS.DRAFT,
    textClassName: 'text-amber-500',
    bgClassName: 'bg-amber-500/10',
    borderClassName: 'border-amber-400',
    activeClassName: 'after:bg-amber-400',
    iconClassName: 'text-amber-600',
    icon: CircleSlashIcon,
  },
  {
    label: 'Deleted',
    value: FAQ_STATUS.DELETED,
    textClassName: 'text-red-500',
    bgClassName: 'bg-red-500/10',
    borderClassName: 'border-red-400',
    activeClassName: 'after:bg-red-400',
    iconClassName: 'text-red-600',
    icon: XCircleIcon,
  },
];
