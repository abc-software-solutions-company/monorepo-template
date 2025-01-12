import { useEffect } from 'react';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useLocale } from 'use-intl';
import { Loading } from '@repo/react-web-ui-shadcn/components/ui/loading';

import { useAuthState } from '../../modules/auth/states/auth.state';

const PageRedirect = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locale = useLocale();
  const { isAuthenticated, user } = useAuthState();

  const language = user?.preference.language ?? locale;

  useEffect(() => {
    navigate({
      pathname: `/${language}/${isAuthenticated ? 'dashboard' : 'login'}`,
      search: `?${createSearchParams(searchParams)}`,
    });
  }, [isAuthenticated, language, searchParams, navigate]);

  return (
    <div className="redirect-page flex grow items-center justify-center p-4">
      <Loading size="lg" thickness={4} />
    </div>
  );
};

export default PageRedirect;
