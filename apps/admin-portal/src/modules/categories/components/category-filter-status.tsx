import { OptionType } from '@/interfaces/status.interface';

import FilterStatus from '@/components/filters/filter-status';

interface ICategoryFilterStatusProps {
  title?: string;
  value: string[];
  options: OptionType[];
  onChange?: (values: string[]) => void;
  onClose?: () => void;
}

export default function CategoryFilterStatus({ title, value = [], options, onChange, onClose }: ICategoryFilterStatusProps) {
  return <FilterStatus title={title} value={value} options={options} onChange={onChange} onClose={onClose} />;
}
