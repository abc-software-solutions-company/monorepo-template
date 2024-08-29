import { useLocation } from 'react-router-dom';
import { useLocale } from 'use-intl';

import PushNotificationPlayGround from './push-notification-playground';

const NotificationRoot = () => {
  const { pathname } = useLocation();
  const locale = useLocale();

  const routes = {
    [`/${locale}/notifications/push`]: <PushNotificationPlayGround />,
  };

  return routes[pathname] || null;
};

export default NotificationRoot;
