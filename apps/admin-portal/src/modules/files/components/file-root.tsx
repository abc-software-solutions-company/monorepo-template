import { FC, useEffect, useState } from 'react';
import classNames from 'classnames';
import { Trash2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useLocale, useTranslations } from 'use-intl';
import ModalConfirm from '@repo/react-web-ui-shadcn/components/modals/modal-confirm';
import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';
import { Loading } from '@repo/react-web-ui-shadcn/components/ui/loading';
import Pagination from '@repo/react-web-ui-shadcn/components/ui/pagination-custom';
import { objectToQueryString } from '@repo/shared-universal/utils/string.util';

import { ComponentBaseProps } from '@/interfaces/component.interface';
import { FileEntity, FileFilter } from '../interfaces/files.interface';

import { DEFAULT_FILTER, MAX_FILE_SIZE_IN_BYTES, MAX_FILES_TO_UPLOAD, VALID_ALL_MIME_TYPES } from '../constants/files.constant';

import { useFileDialogState } from '../hooks/use-file-dialog-state';

import ItemsPerPage from '@/components/item-per-page';
import NoData from '@/components/no-data';
import PaginationInfo from '@/components/pagination-info';
import Uploader from '@/components/uploader';

import Filter from './file-filter';
import FileList from './file-list';

import FileApi from '../api/files.api';
import { useFilesState } from '../states/files.state';
import { uploadValidator } from '../validators/upload.validator';

type FilesRootTypes = {
  selected?: FileEntity[];
} & ComponentBaseProps;

const FilesRoot: FC<FilesRootTypes> = ({ className }) => {
  const t = useTranslations();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locale = useLocale();
  const filesState = useFilesState();
  const [isUploading, setIsUploading] = useState(false);
  const fileDialogState = useFileDialogState();
  const [isShowDeleteConfirm, setIsShowDeleteConfirm] = useState(false);

  const { items, meta, filter, filteredAt } = filesState;
  const categoryId: string | null = searchParams.get('categoryId');

  const getFilter = (): FileFilter => {
    return {
      categoryId: categoryId || DEFAULT_FILTER.categoryId,
      q: searchParams.get('q') || DEFAULT_FILTER.q,
      page: parseInt(searchParams.get('page') as string) || DEFAULT_FILTER.page,
      limit: parseInt(searchParams.get('limit') as string) || DEFAULT_FILTER.limit,
      order: searchParams.get('order') || DEFAULT_FILTER.order,
      status: searchParams.getAll('status') || DEFAULT_FILTER.status,
      mime: searchParams.get('mime') || DEFAULT_FILTER.mime,
    };
  };

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

  const handleBulkDelete = async () => {
    if (!fileDialogState.selectedItems?.length) return;
    setIsShowDeleteConfirm(true);
  };

  const onConfirmDelete = async () => {
    try {
      await FileApi.bulkDestroy({ ids: fileDialogState.selectedItems.map(item => item.id) });
      toast.success(t('file_delete_success'));
      fileDialogState.setSelectedItems([]);
      filesState.listRequest({ filter });
    } catch (error) {
      toast.error(t('file_delete_failure'));
    } finally {
      setIsShowDeleteConfirm(false);
    }
  };

  useEffect(() => {
    const currentFilter = getFilter();

    if (filter) {
      const queryString = objectToQueryString({ ...filter, sidebar: searchParams.get('sidebar') });

      navigate({
        pathname: `/${locale}/files`,
        search: `?${queryString}`,
      });

      filesState.listRequest({ filter });
    } else {
      filesState.setFilter(currentFilter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredAt]);

  return (
    <div className={classNames('flex grow flex-col', className)}>
      <div className="flex items-center justify-between">
        <Filter
          onSearch={text => filesState.setFilter({ q: text })}
          onResetFilter={() =>
            filesState.setFilter({
              ...DEFAULT_FILTER,
              categoryId: filter?.categoryId,
            })
          }
        />
        <div className="flex items-center gap-2">
          <Button variant="destructive" size="sm" disabled={!fileDialogState.selectedItems?.length} onClick={handleBulkDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            {t('file_delete')} {fileDialogState.selectedItems?.length ? `(${fileDialogState.selectedItems.length})` : ''}
          </Button>
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
      </div>
      <div className="mt-4 flex grow flex-col">
        <div className="flex h-full flex-col rounded-lg border bg-card p-4">
          {filesState.isFetching ? (
            <div className="flex grow items-center justify-center">
              <Loading className="mx-auto" />
            </div>
          ) : (
            <>
              {!filesState.error && filesState.items.length > 0 ? (
                <FileList
                  className="grid grid-cols-3 gap-4 md:grid-cols-5 xl:grid-cols-8 2xl:grid-cols-10"
                  data={items}
                  selectedItems={fileDialogState.selectedItems}
                  onItemClick={file => fileDialogState.setSelectedItem('multiple', file)}
                />
              ) : (
                <NoData />
              )}
            </>
          )}
        </div>
      </div>
      <div className="mt-3 flex justify-between">
        <div className="flex items-center space-x-2">
          <ItemsPerPage limit={filter?.limit} onFilter={value => filesState.setFilter({ page: 1, limit: +value })} />
          <PaginationInfo amount={meta?.paging?.totalItems} text={t('file_records')} />
        </div>
        <Pagination
          totalItems={meta?.paging?.totalItems || 0}
          currentPage={meta?.paging?.currentPage}
          itemPerPage={meta?.paging?.itemsPerPage}
          onChange={page => filesState.setFilter({ page })}
        />
      </div>
      <ModalConfirm
        visible={isShowDeleteConfirm}
        title={t('file_confirm_title')}
        message={t('file_confirm_delete')}
        onNo={() => setIsShowDeleteConfirm(false)}
        onYes={onConfirmDelete}
      />
    </div>
  );
};

export default FilesRoot;
