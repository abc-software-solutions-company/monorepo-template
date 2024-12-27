import { FC, useEffect } from 'react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~react-web-ui-shadcn/components/ui/dialog';
import { Loading } from '~react-web-ui-shadcn/components/ui/loading';
import { Separator } from '~react-web-ui-shadcn/components/ui/separator';

import ContentRenderer from '@/components/content-renderer';

import { usePostsState } from '@/modules/posts/states/posts.state';

type PostDialogDetailProps = {
  id: string;
  visible: boolean;
  onCancel?: () => void;
};

const PostDialogDetail: FC<PostDialogDetailProps> = ({ id, visible, onCancel }) => {
  const postsState = usePostsState();

  useEffect(() => {
    if (visible) {
      postsState.readRequest(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, id]);

  return (
    <Dialog open={visible} onOpenChange={onCancel}>
      <DialogContent className="top-0 max-w-7xl translate-y-0">
        {postsState.isReading && (
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

        {!postsState.isReading && !!postsState.detail && (
          <>
            <DialogHeader>
              <DialogTitle>{postsState.detail.name}</DialogTitle>
              <VisuallyHidden>
                <DialogDescription></DialogDescription>
              </VisuallyHidden>
            </DialogHeader>
            <div className="wysiwyg prose-sm p-4">
              <div>
                <ContentRenderer data={postsState.detail.description} />
              </div>
              <Separator className="my-4" />
              <div>
                <ContentRenderer data={postsState.detail.body} />
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PostDialogDetail;
