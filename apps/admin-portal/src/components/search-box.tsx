import { ChangeEvent, useEffect, useState } from 'react';
import classNames from 'classnames';
import { SearchIcon } from 'lucide-react';
import { useTranslations } from 'use-intl';
import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';
import { Input } from '@repo/react-web-ui-shadcn/components/ui/input';

import { ComponentBaseProps } from '@/interfaces/component.interface';

type SearchBoxProps = {
  value?: string;
  placeholder?: string;
  onKeywordChange?: (text: string) => void;
  onSearch?: (text: string) => void;
} & ComponentBaseProps;

function SearchBox({ className, value = '', placeholder, onKeywordChange, onSearch }: SearchBoxProps) {
  const t = useTranslations();
  const [val, setVal] = useState(value);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setVal(event.target.value);
    onKeywordChange?.(event.target.value);
  };

  useEffect(() => {
    setVal(value);
  }, [value]);

  return (
    <div className={classNames('flex items-center gap-x-1', className)}>
      <Input
        className="w-full pr-10"
        placeholder={placeholder ?? t('keyword') + '...'}
        value={val}
        onChange={handleChange}
        onKeyUp={event => {
          if (event.key === 'Enter') onSearch?.(val);
        }}
      />
      <Button className="z-0 -ml-10 h-9 rounded-l-none rounded-r-sm p-2" variant="ghost" onClick={() => onSearch?.(val)}>
        <SearchIcon size={18} />
      </Button>
    </div>
  );
}

export default SearchBox;
