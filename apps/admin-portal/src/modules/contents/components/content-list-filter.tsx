import { FC } from 'react';
import classNames from 'classnames';
import { useTranslations } from 'use-intl';
import { Button } from '~react-web-ui-shadcn/components/ui/button';

import { ComponentBaseProps } from '@/interfaces/component.interface';
import { ContentFilter } from '../interfaces/contents.interface';

import { CONTENT_DEFAULT_FILTER } from '../constants/contents.constant';

import SearchBox from '@/components/search-box';

type ContentListFilterProps = {
  filter: ContentFilter;
  setFilter: (filter: ContentFilter) => void;
} & ComponentBaseProps;

const ContentListFilter: FC<ContentListFilterProps> = ({ className, filter, setFilter }) => {
  const t = useTranslations();

  return (
    <div className={classNames('flex w-full gap-x-3', className)}>
      <SearchBox value={filter.q} placeholder={t('keyword')} onSearch={value => setFilter({ ...filter, q: value })} />
      <Button variant="outline" onClick={() => setFilter(CONTENT_DEFAULT_FILTER)}>
        {t('filter_reset')}
      </Button>
    </div>
  );
};

export default ContentListFilter;
