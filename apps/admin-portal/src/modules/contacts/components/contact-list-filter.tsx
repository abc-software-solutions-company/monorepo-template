import { FC } from 'react';
import classNames from 'classnames';
import { useTranslations } from 'use-intl';
import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';

import { ComponentBaseProps } from '@/interfaces/component.interface';
import { ContactFilter } from '../interfaces/contacts.interface';

import { CONTACT_DEFAULT_FILTER } from '../constants/contacts.constant';

import SearchBox from '@/components/search-box';

type ContactListFilterProps = {
  filter: ContactFilter;
  setFilter: (filter: ContactFilter) => void;
} & ComponentBaseProps;

const ContactListFilter: FC<ContactListFilterProps> = ({ className, filter, setFilter }) => {
  const t = useTranslations();

  return (
    <div className={classNames('flex w-full gap-x-3', className)}>
      <SearchBox value={filter.q} placeholder={t('keyword')} onSearch={value => setFilter({ ...filter, q: value })} />
      <Button variant="outline" onClick={() => setFilter(CONTACT_DEFAULT_FILTER)}>
        {t('filter_reset')}
      </Button>
    </div>
  );
};

export default ContactListFilter;
