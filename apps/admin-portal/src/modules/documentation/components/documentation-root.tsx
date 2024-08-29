import { useLocation } from 'react-router-dom';
import { useLocale } from 'use-intl';

import DocumentationChangelogs from './documentation-changelogs';
import DocumentationComponents from './documentation-components';
import DocumentationGettingStarted from './documentation-getting-started';

const DocumentationRoot = () => {
  const { pathname } = useLocation();
  const locale = useLocale();

  const routes = {
    [`/${locale}/documentation/getting-started`]: <DocumentationGettingStarted />,
    [`/${locale}/documentation/components`]: <DocumentationComponents />,
    [`/${locale}/documentation/changelogs`]: <DocumentationChangelogs />,
  };

  return routes[pathname] || null;
};

export default DocumentationRoot;
