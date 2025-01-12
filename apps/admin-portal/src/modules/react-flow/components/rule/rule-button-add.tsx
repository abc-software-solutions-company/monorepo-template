import { FC } from 'react';
import { PlusCircleIcon } from 'lucide-react';
import { cn } from '@repo/react-web-ui-shadcn/lib/utils';

type RuleButtonAddProps = {
  className?: string;
  visibled?: boolean;
  orientation?: 'horizontal' | 'vertical';
  onClick?: () => void;
};

const RuleButtonAdd: FC<RuleButtonAddProps> = ({ className, visibled = true, orientation = 'horizontal', onClick }) => {
  const containerClasses = {
    horizontal: 'absolute bottom-12 -right-10 flex items-center justify-center',
    vertical: 'absolute -bottom-10 right-1/2 translate-x-1/2 flex flex-col items-center justify-center',
  };

  const lineClasses = {
    horizontal: 'w-4 border-b border border-dashed border-gray-400',
    vertical: 'h-4 border-r border border-dashed border-gray-400',
  };

  if (!visibled) return null;

  return (
    <button type="button" className={cn(containerClasses[orientation], className)} onClick={onClick}>
      <div className={lineClasses[orientation]}></div>
      <PlusCircleIcon className="rounded-full bg-white text-gray-500" />
    </button>
  );
};

export default RuleButtonAdd;
