import PageWrapper from '@/components/pages/page-wrapper';

import UserForm from '@/modules/users/components/user-form';
import useUserToast from '@/modules/users/hooks/use-user-toast';

const PageUserNew = () => {
  useUserToast();

  return (
    <PageWrapper>
      <UserForm isEdit={false} />
    </PageWrapper>
  );
};

export default PageUserNew;
