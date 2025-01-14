import { FC, useEffect } from 'react';
import { useLocale } from 'use-intl';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@repo/react-web-ui-shadcn/components/ui/dialog';
import { Loading } from '@repo/react-web-ui-shadcn/components/ui/loading';
import { Separator } from '@repo/react-web-ui-shadcn/components/ui/separator';

import ContentRenderer from '@/components/content-renderer';

import { usePostsState } from '@/modules/posts/states/posts.state';

type PostDialogDetailProps = {
  id: string;
  visible: boolean;
  onCancel?: () => void;
};

const PostDialogDetail: FC<PostDialogDetailProps> = ({ id, visible, onCancel }) => {
  const locale = useLocale();
  const postsState = usePostsState();

  const name = postsState.detail?.nameLocalized?.find(x => x.lang === locale)?.value ?? '';
  const description = postsState.detail?.descriptionLocalized?.find(x => x.lang === locale)?.value ?? '';
  const body = postsState.detail?.bodyLocalized?.find(x => x.lang === locale)?.value ?? '';

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
                <DialogTitle>{name}</DialogTitle>
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
              <DialogTitle>{name}</DialogTitle>
              <VisuallyHidden>
                <DialogDescription></DialogDescription>
              </VisuallyHidden>
            </DialogHeader>
            <div className="wysiwyg prose-sm p-4">
              <div>
                <ContentRenderer data={description} />
              </div>
              <Separator className="my-4" />
              <div>
                <ContentRenderer data={body} />
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PostDialogDetail;
