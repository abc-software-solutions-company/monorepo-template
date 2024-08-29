import { useLocation } from 'react-router-dom';
import { useTranslations } from 'use-intl';

const HeaderTitle = () => {
  const location = useLocation();
  const t = useTranslations();

  const name = location.pathname.replaceAll('-', '_').split('/')[2];

  return <h1 className="text-xl font-bold">{t(`page_${name}`)}</h1>;
};

export default HeaderTitle;
