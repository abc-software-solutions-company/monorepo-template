import { FC, ReactNode } from 'react';
import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@repo/react-web-ui-shadcn/components/ui/dialog';

type ModalInfoProps = {
  visible: boolean;
  title: string;
  content?: ReactNode;
  btnClose?: string;
  onClose: () => void;
};

const ModalInfo: FC<ModalInfoProps> = ({ visible = false, title, content, btnClose, onClose }) => {
  return (
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{content}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary" onClick={onClose}>
              {btnClose ?? 'Close'}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalInfo;
