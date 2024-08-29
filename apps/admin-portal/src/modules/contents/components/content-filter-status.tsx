import { OptionType } from '@/interfaces/status.interface';

import FilterStatus from '@/components/filters/filter-status';

interface IContentFilterStatusProps {
  title?: string;
  value: string[];
  options: OptionType[];
  onChange?: (values: string[]) => void;
  onClose?: () => void;
}

export default function ContentFilterStatus({ title, value = [], options, onChange, onClose }: IContentFilterStatusProps) {
  return <FilterStatus title={title} value={value} options={options} onChange={onChange} onClose={onClose} />;
}
