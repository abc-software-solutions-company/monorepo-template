import React, { FC } from 'react';
import { ds } from '@repo/react-native-design-system';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/react-native-ui-core/components/avatar';
import Text from '@repo/react-native-ui-core/components/text';
import View from '@repo/react-native-ui-core/components/view';

import { useAuthState } from '@/modules/auth/states/auth.state';

type ProfileAvatarProps = {};

const ProfileAvatar: FC<ProfileAvatarProps> = () => {
  const { user } = useAuthState();

  const userAvatar = user?.avatar;
  const userName = user?.name;

  return (
    <View>
      <View style={ds.itemsCenter}>
        <View style={ds.itemsCenter}>
          <Avatar size={90}>
            <AvatarImage src={userAvatar} />
            <AvatarFallback fontSize={50} lineHeight={60}>
              {userName}
            </AvatarFallback>
          </Avatar>
          <Text style={ds.mt10} fontSize={20} fontWeight="Bold">
            {user?.name}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ProfileAvatar;
