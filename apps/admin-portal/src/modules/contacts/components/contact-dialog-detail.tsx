import { FC } from 'react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~react-web-ui-shadcn/components/ui/dialog';
import { Loading } from '~react-web-ui-shadcn/components/ui/loading';

import Box from '@/components/box';

import ContactApi from '../api/contacts.api';

type ContactDialogDetailProps = {
  id: string;
  visible: boolean;
  onCancel?: () => void;
};

const ContactDialogDetail: FC<ContactDialogDetailProps> = ({ id, visible, onCancel }) => {
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
            <Box>
              <code>{data.message}</code>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ContactDialogDetail;
