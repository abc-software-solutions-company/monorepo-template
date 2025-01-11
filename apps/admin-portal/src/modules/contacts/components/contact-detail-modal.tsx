import { FC } from 'react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@repo/react-web-ui-shadcn/components/ui/dialog';
import { Loading } from '@repo/react-web-ui-shadcn/components/ui/loading';
import { useQuery } from '@tanstack/react-query';

import ContactApi from '../api/contacts.api';

type ContactDetailModalProps = {
  id: string;
  visible: boolean;
  onCancel?: () => void;
};

const ContactDetailModal: FC<ContactDetailModalProps> = ({ id, visible, onCancel }) => {
  const { data, isFetching, isFetched } = useQuery({
    queryKey: ['get-contact', id],
    queryFn: async () => {
      const res = await ContactApi.read(id);

      return res.data.data;
    },
    enabled: visible && !!id,
    gcTime: 0,
  });

  return (
    <Dialog open={visible} onOpenChange={onCancel}>
      <DialogContent className="top-0 max-w-7xl translate-y-0">
        {isFetching && (
          <>
            <VisuallyHidden>
              <DialogHeader>
                <DialogTitle></DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
            </VisuallyHidden>
            <div className="flex items-center justify-center py-10">
              <Loading />
            </div>
          </>
        )}
        {isFetched && data && (
          <>
            <DialogHeader>
              <DialogTitle>{data.name}</DialogTitle>
              <DialogDescription>{data.email}</DialogDescription>
            </DialogHeader>
            <div className="p-4">
              <div className="rounded-lg border bg-muted p-3">
                <code>{data.message}</code>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ContactDetailModal;
