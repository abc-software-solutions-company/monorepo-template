import React, { FC } from 'react';
import { ds } from '@repo/react-native-design-system';
import View from '@repo/react-native-ui-core/components/view';

import { NotificationEntity } from '../interfaces/notifications.interface';

import NotificationItem from './notification-item';

type NotificationListProps = {
  items: NotificationEntity[];
};

const NotificationList: FC<NotificationListProps> = ({ items }) => {
  return (
    <View style={ds.gap10}>
      {items.map(item => (
        <NotificationItem key={item.id} item={item} />
      ))}
    </View>
  );
};

export default NotificationList;
