import { CheckCircle2Icon, XCircleIcon } from 'lucide-react';

import { OptionType } from '@/interfaces/status.interface';
import { ContactFilter } from '../interfaces/contacts.interface';

export enum CONTACT_STATUS {
  VISBLED = 'visibled',
  DELETED = 'deleted',
}

export const CONTACT_DEFAULT_FILTER: ContactFilter = {
  q: '',
  page: 1,
  limit: 50,
  order: 'DESC',
  status: [],
};

export const CONTACT_STATUSES: OptionType[] = [
  {
    label: 'Visible',
    value: CONTACT_STATUS.VISBLED,
    textClassName: 'text-green-500',
    bgClassName: 'bg-green-500/10',
    borderClassName: 'border-green-400',
    activeClassName: 'after:bg-green-400',
    iconClassName: 'text-green-600',
    icon: CheckCircle2Icon,
  },
  {
    label: 'Delete',
    value: CONTACT_STATUS.DELETED,
    textClassName: 'text-red-500',
    bgClassName: 'bg-red-500/10',
    borderClassName: 'border-red-400',
    activeClassName: 'after:bg-red-400',
    iconClassName: 'text-red-600',
    icon: XCircleIcon,
  },
];
