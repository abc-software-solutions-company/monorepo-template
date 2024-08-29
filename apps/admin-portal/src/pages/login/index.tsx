import { Navigate } from 'react-router-dom';

import LoginForm from '@/modules/auth/components/form-login';
import { useAuthState } from '@/modules/auth/states/auth.state';

function PageLogin() {
  const { isAuthenticated } = useAuthState();

  if (isAuthenticated) {
    return <Navigate replace to={'/'} />;
  }

  return (
    <div className="relative grow">
      <LoginForm />
    </div>
  );
}

export default PageLogin;
