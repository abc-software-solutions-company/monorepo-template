import { FC } from 'react';
import classNames from 'classnames';
import { useTranslations } from 'use-intl';
import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';

import { ComponentBaseProps } from '@/interfaces/component.interface';
import { FaqFilter } from '../interfaces/faqs.interface';

import { FAQ_DEFAULT_FILTER } from '../constants/faqs.constant';

import SearchBox from '@/components/search-box';

type FaqListFilterProps = {
  filter: FaqFilter;
  setFilter: (filter: FaqFilter) => void;
} & ComponentBaseProps;

const FaqListFilter: FC<FaqListFilterProps> = ({ className, filter, setFilter }) => {
  const t = useTranslations();

  return (
    <div className={classNames('flex w-full gap-x-3', className)}>
      <SearchBox value={filter.q} placeholder={t('keyword')} onSearch={value => setFilter({ ...filter, q: value })} />
      <Button variant="outline" onClick={() => setFilter(FAQ_DEFAULT_FILTER)}>
        {t('filter_reset')}
      </Button>
    </div>
  );
};

export default FaqListFilter;
