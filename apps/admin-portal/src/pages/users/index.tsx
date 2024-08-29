import PageWrapper from '@/components/pages/page-wrapper';

import UserList from '@/modules/users/components/user-list';
import useUserToast from '@/modules/users/hooks/use-user-toast';

const PageUserList = () => {
  useUserToast();

  return (
    <PageWrapper>
      <UserList />
    </PageWrapper>
  );
};

export default PageUserList;
