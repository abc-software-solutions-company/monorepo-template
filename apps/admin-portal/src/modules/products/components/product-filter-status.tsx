import { OptionType } from '@/interfaces/status.interface';

import FilterStatus from '@/components/filters/filter-status';

interface IProductFilterStatusProps {
  title?: string;
  value: string[];
  options: OptionType[];
  onChange?: (values: string[]) => void;
  onClose?: () => void;
}

export default function ProductFilterStatus({ title, value = [], options, onChange, onClose }: IProductFilterStatusProps) {
  return <FilterStatus title={title} value={value} options={options} onChange={onChange} onClose={onClose} />;
}
