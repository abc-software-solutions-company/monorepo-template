import PageWrapper from '@/components/pages/page-wrapper';

import FilesRoot from '@/modules/files/components/file-root';

const PageFileList = () => {
  return (
    <PageWrapper>
      <FilesRoot categoryVisible={false} />
    </PageWrapper>
  );
};

export default PageFileList;
