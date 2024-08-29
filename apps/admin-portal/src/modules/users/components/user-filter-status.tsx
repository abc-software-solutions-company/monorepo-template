import { OptionType } from '@/interfaces/status.interface';

import FilterStatus from '@/components/filters/filter-status';

interface IUserFilterStatusProps {
  title?: string;
  value: string[];
  options: OptionType[];
  onChange?: (values: string[]) => void;
  onClose?: () => void;
}

export default function UserFilterStatus({ title, value = [], options, onChange, onClose }: IUserFilterStatusProps) {
  return <FilterStatus title={title} value={value} options={options} onChange={onChange} onClose={onClose} />;
}
