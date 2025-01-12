import { FC } from 'react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@repo/react-web-ui-shadcn/components/ui/alert-dialog';
import { Loading } from '@repo/react-web-ui-shadcn/components/ui/loading';

type ModalLoadingProps = {
  visible: boolean;
  onClose?: () => void;
};

const ModalLoading: FC<ModalLoadingProps> = ({ visible = false, onClose }) => {
  return (
    <AlertDialog open={visible}>
      <AlertDialogContent className="flex max-w-32 flex-col items-center justify-center">
        <VisuallyHidden>
          <AlertDialogHeader>
            <AlertDialogTitle>Loading...</AlertDialogTitle>
            <AlertDialogDescription>Loading...</AlertDialogDescription>
          </AlertDialogHeader>
        </VisuallyHidden>
        <Loading thickness={6} size={'lg'} onClick={onClose} />
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ModalLoading;
