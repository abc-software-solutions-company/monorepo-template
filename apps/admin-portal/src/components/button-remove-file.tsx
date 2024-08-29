import { FC } from 'react';
import classNames from 'classnames';
import { XIcon } from 'lucide-react';

import { ComponentBaseProps } from '@/interfaces/component.interface';

type ButtonRemoveFileProps = {
  onClick?: () => void;
} & ComponentBaseProps;

const ButtonRemoveFile: FC<ButtonRemoveFileProps> = ({ className, onClick }) => {
  return (
    <button type="button" className={classNames('absolute right-1 top-1 rounded bg-primary/60 text-white', className)} onClick={onClick}>
      <XIcon size={16} />
      <span className="sr-only">Remove file</span>
    </button>
  );
};

export default ButtonRemoveFile;
