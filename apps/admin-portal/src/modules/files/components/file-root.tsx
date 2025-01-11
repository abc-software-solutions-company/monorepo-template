import { FC, useEffect, useState } from 'react';
import classNames from 'classnames';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLocale, useTranslations } from 'use-intl';
import { Loading } from '@repo/react-web-ui-shadcn/components/ui/loading';
import Pagination from '@repo/react-web-ui-shadcn/components/ui/pagination-custom';
import { useToast } from '@repo/react-web-ui-shadcn/components/ui/use-toast';
import { objectToQueryString } from '@repo/shared-universal/utils/string.util';

import { ComponentBaseProps } from '@/interfaces/component.interface';
import { FileEntity, FileFilter } from '../interfaces/files.interface';

import { DEFAULT_FILTER, MAX_FILE_SIZE_IN_BYTES, MAX_FILES_TO_UPLOAD, VALID_ALL_MIME_TYPES } from '../constants/files.constant';

import ItemsPerPage from '@/components/item-per-page';
import NoData from '@/components/no-data';
import PaginationInfo from '@/components/pagination-info';
import Uploader from '@/components/uploader';

import DirectoryTree from '@/modules/categories/components/directory-tree';
import { CATEGORY_TYPE } from '@/modules/categories/constants/categories.constant';
import { CategoryEntity } from '@/modules/categories/interfaces/categories.interface';
import { useCategoriesState } from '@/modules/categories/states/categories.state';

import Filter from './file-filter';
import FileList from './file-list';

import FileApi from '../api/files.api';
import { useFilesState } from '../states/files.state';
import { uploadValidator } from '../validators/upload.validator';

type FilesRootTypes = {
  categoryVisible?: boolean;
  selected?: FileEntity[];
} & ComponentBaseProps;

const FilesRoot: FC<FilesRootTypes> = ({ className, categoryVisible = true }) => {
  const t = useTranslations();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locale = useLocale();
  const { toast } = useToast();
  const filesState = useFilesState();
  const categoriesState = useCategoriesState();
  const [isUploading, setIsUploading] = useState(false);

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
    if (categoryVisible) categoriesState.listRequest({ filter: { type: CATEGORY_TYPE.FILE } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryVisible]);

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
      <div className="mt-4 flex grow flex-col">
        {categoryVisible && (
          <>
            <div className="h-full flex-col rounded-lg border bg-card p-4">
              <DirectoryTree
                data={[{ name: 'All', id: '' } as CategoryEntity, ...categoriesState.items]}
                onItemClick={node => filesState.setFilter({ categoryId: node.id, page: 1 })}
              />
            </div>
          </>
        )}
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
                  type={'list'}
                  selectedItems={[]}
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
    </div>
  );
};

export default FilesRoot;
