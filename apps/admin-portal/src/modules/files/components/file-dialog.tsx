import { FC, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';
import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@repo/react-web-ui-shadcn/components/ui/dialog';
import { Loading } from '@repo/react-web-ui-shadcn/components/ui/loading';
import Pagination from '@repo/react-web-ui-shadcn/components/ui/pagination-custom';
import useDeepCompareEffect from '@repo/shared-universal/hooks/use-deep-compare-effect';

import { ComponentBaseProps } from '@/interfaces/component.interface';
import { FileEntity, FileFilter } from '../interfaces/files.interface';

import { DEFAULT_FILTER, FILE_STATUS, MAX_FILE_SIZE_IN_BYTES, MAX_FILES_TO_UPLOAD, VALID_ALL_MIME_TYPES } from '../constants/files.constant';

import { useFileDialogState } from '../hooks/use-file-dialog-state';

import ItemsPerPage from '@/components/item-per-page';
import NoData from '@/components/no-data';
import Uploader from '@/components/uploader';

import Filter from './file-filter';
import FileList from './file-list';

import FileApi from '../api/files.api';
import { useFilesState } from '../states/files.state';
import { uploadValidator } from '../validators/upload.validator';

type FileDialogProps = {
  type: 'single' | 'multiple';
  mime?: string;
  visible: boolean;
  selectedItems: FileEntity[];
  onCancel?: () => void;
  onSelectClick?: (items: FileEntity[]) => void;
} & ComponentBaseProps;

const FileDialog: FC<FileDialogProps> = ({ type = 'single', mime, visible, onCancel, onSelectClick }) => {
  const t = useTranslations();
  const filesState = useFilesState();
  const [filter, setFilter] = useState<FileFilter>({ ...DEFAULT_FILTER, mime, status: [FILE_STATUS.PUBLISHED] });
  const [isUploading, setIsUploading] = useState(false);
  const fileDialogState = useFileDialogState();

  const { items, meta } = filesState;
  const categoryId = null;

  const onUpload = (files: FileList) => {
    const validateResult = uploadValidator.safeParse({ categoryId, files });

    if (!validateResult.success) {
      const errors = validateResult.error.errors.map(err => err.message);

      toast(t('Upload'), { description: errors.join('<br>') });
    } else {
      setIsUploading(true);

      FileApi.upload({ categoryId, files }).then(() => {
        filesState.listRequest({ filter });

        setIsUploading(false);
      });
    }
  };

  useEffect(() => {
    fileDialogState.clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  useEffect(() => {
    fileDialogState.setType(type);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  useDeepCompareEffect(() => {
    if (!visible) return;

    if (filter) {
      filesState.listRequest({ filter });
    } else {
      setFilter(DEFAULT_FILTER);
    }
  }, [filter, visible]);

  return (
    <Dialog open={visible} modal={true} onOpenChange={() => onCancel?.()}>
      <DialogContent className="top-0 max-w-5xl translate-y-0 bg-card p-0">
        <DialogHeader className="p-4">
          <DialogTitle>{t('assets')}</DialogTitle>
        </DialogHeader>
        <div className="p-4 pt-0">
          <div className="flex items-center justify-between">
            <Filter
              onSearch={text => setFilter({ ...filter, q: text })}
              onResetFilter={() => setFilter({ ...filter, categoryId: filter?.categoryId })}
            />
            <Uploader
              triggerContent={t('add_new_assets')}
              multiple={true}
              loading={isUploading}
              maxFileSize={MAX_FILE_SIZE_IN_BYTES}
              maxFiles={MAX_FILES_TO_UPLOAD}
              accept={VALID_ALL_MIME_TYPES.join(',')}
              onChange={onUpload}
            />
          </div>
          {filesState.isFetching ? (
            <div className="flex min-h-32 grow items-center justify-center">
              <Loading className="mx-auto" />
            </div>
          ) : (
            <>
              {!filesState.error && filesState.items.length > 0 ? (
                <FileList
                  className="mt-4 grid grid-cols-3 gap-4 md:grid-cols-5 xl:grid-cols-7"
                  data={items}
                  selectedItems={fileDialogState.selectedItems}
                  onItemClick={file => fileDialogState.setSelectedItem(type, file)}
                />
              ) : (
                <NoData className="min-h-32" />
              )}
            </>
          )}
        </div>
        <DialogFooter className="rounded-b-lg bg-background p-4">
          <div className="flex w-full items-center justify-between">
            <Button variant={'outline'} onClick={() => onCancel?.()}>
              {t('close')}
            </Button>
            <div className="flex items-center justify-center space-x-4">
              <ItemsPerPage limit={filter?.limit} onFilter={value => setFilter({ ...filter, page: 1, limit: +value })} />
              <Pagination
                totalItems={meta?.paging?.totalItems || 0}
                currentPage={meta?.paging?.currentPage}
                itemPerPage={meta?.paging?.itemsPerPage}
                onChange={page => setFilter({ ...filter, page })}
              />
            </div>
            <Button disabled={fileDialogState.selectedItems.length === 0} onClick={() => onSelectClick?.(fileDialogState.selectedItems)}>
              {t('file_choose_selected')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FileDialog;
