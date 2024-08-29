import { OptionType } from '@/interfaces/status.interface';

import FilterStatus from '@/components/filters/filter-status';

interface IPostFilterStatusProps {
  title?: string;
  value: string[];
  options: OptionType[];
  onChange?: (values: string[]) => void;
  onClose?: () => void;
}

export default function PostFilterStatus({ title, value = [], options, onChange, onClose }: IPostFilterStatusProps) {
  return <FilterStatus title={title} value={value} options={options} onChange={onChange} onClose={onClose} />;
}
