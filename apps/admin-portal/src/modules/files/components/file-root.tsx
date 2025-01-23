import { FC, useEffect, useState } from 'react';
import classNames from 'classnames';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLocale, useTranslations } from 'use-intl';
import ModalConfirm from '@repo/react-web-ui-shadcn/components/modals/modal-confirm';
import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';
import { Loading } from '@repo/react-web-ui-shadcn/components/ui/loading';
import Pagination from '@repo/react-web-ui-shadcn/components/ui/pagination-custom';
import { useToast } from '@repo/react-web-ui-shadcn/components/ui/use-toast';
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
  const { toast } = useToast();
  const filesState = useFilesState();
  const [isUploading, setIsUploading] = useState(false);
  const [isOpenBulkDeleteModal, setIsOpenBulkDeleteModal] = useState(false);
  const fileDialogState = useFileDialogState();

  const { items, meta, filter, filteredAt, deletedAt } = filesState;

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

      toast({ title: 'Upload', description: errors.join('<br>') });
    } else {
      setIsUploading(true);

      FileApi.upload({ categoryId, files }).then(() => {
        filesState.listRequest({ filter });

        setIsUploading(false);
      });
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

  useEffect(() => {
    if (deletedAt && fileDialogState.selectedItems.length > 0) {
      fileDialogState.clear();
      setIsOpenBulkDeleteModal(false);
      toast({ title: t('delete'), description: t('file_delete_mutil_success') });
    }
  }, [deletedAt]);

  return (
    <div className={classNames('flex grow flex-col', className)}>
      <div className="mt-4 flex grow flex-col">
        <div className="flex h-full flex-col gap-4 rounded-lg border bg-card p-4">
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
            <div className="flex items-center gap-4">
              <Button
                variant={'outline'}
                disabled={fileDialogState.selectedItems.length === 0}
                onClick={() => {
                  setIsOpenBulkDeleteModal(true);
                }}
              >
                {t('file_delete_assets')}
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
          {filesState.isFetching ? (
            <div className="flex grow items-center justify-center">
              <Loading className="mx-auto" />
            </div>
          ) : (
            <>
              {!filesState.error && filesState.items.length > 0 ? (
                <div className="grow">
                  <FileList
                    type={fileDialogState.type}
                    className="grid grid-cols-3 gap-4 md:grid-cols-5 xl:grid-cols-8 2xl:grid-cols-10"
                    data={items}
                    selectedItems={fileDialogState.selectedItems}
                    onItemClick={file => fileDialogState.setSelectedItem('multiple', file)}
                  />
                </div>
              ) : (
                <NoData />
              )}
            </>
          )}
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
        </div>
      </div>
      <ModalConfirm
        visible={isOpenBulkDeleteModal}
        title={t('delete')}
        content={
          <>
            <p className="font-bold text-rose-500">
              <span>{t('file_delete_assets_confirm')}</span>
            </p>
            {fileDialogState.selectedItems.map(item => (
              <p key={item.id}>
                <strong className="ml-1">{item.uniqueName}</strong>
              </p>
            ))}
          </>
        }
        onYes={() => {
          filesState.bulkDestroyRequest({ ids: fileDialogState.selectedIds });
        }}
        onNo={() => setIsOpenBulkDeleteModal(false)}
      />
    </div>
  );
};

export default FilesRoot;
