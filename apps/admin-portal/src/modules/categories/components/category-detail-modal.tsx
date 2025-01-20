import { FC, useEffect, useState } from 'react';
import { useLocale } from 'use-intl';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@repo/react-web-ui-shadcn/components/ui/dialog';
import { Loading } from '@repo/react-web-ui-shadcn/components/ui/loading';
import { Separator } from '@repo/react-web-ui-shadcn/components/ui/separator';

import { useGetCategoryQuery } from '../hooks/use-category-queries';

import ContentRenderer from '@/components/content-renderer';

type CategoryDetailModalProps = {
  id: string;
  visible: boolean;
  onCancel?: () => void;
};

const CategoryDetailModal: FC<CategoryDetailModalProps> = ({ id, visible, onCancel }) => {
  const locale = useLocale();
  const [isVisible, setIsVisible] = useState(false);
  const { data: content, isFetching } = useGetCategoryQuery({ id, enabled: isVisible });

  const name = content?.data.nameLocalized?.find(x => x.lang === locale)?.value ?? '';
  const description = content?.data.descriptionLocalized?.find(x => x.lang === locale)?.value ?? '';
  const body = content?.data.bodyLocalized?.find(x => x.lang === locale)?.value ?? '';

  useEffect(() => {
    if (visible) {
      setIsVisible(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, id]);

  return (
    <Dialog open={visible} onOpenChange={onCancel}>
      <DialogContent className="top-0 max-w-7xl translate-y-0">
        {isFetching && (
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

        {!isFetching && (
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

export default CategoryDetailModal;
