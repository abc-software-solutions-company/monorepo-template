import React from 'react';
import { Pressable, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ds } from '@repo/react-native-design-system';
import { dynamicStyles } from '@repo/react-native-design-system/utils/style.util';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/react-native-ui-core/components/avatar';
import Icon from '@repo/react-native-ui-core/components/icon';
import Text from '@repo/react-native-ui-core/components/text';
import { useCoreUITheme } from '@repo/react-native-ui-core/themes/theme.context';

import { useAuthState } from '@/modules/auth/states/auth.state';
import { AuthenticatedNavigationProps } from '@/modules/navigation/interfaces/navigation.interface';

function TravelHeader() {
  const navigation = useNavigation<AuthenticatedNavigationProps>();
  const { configs } = useCoreUITheme();
  const { user } = useAuthState();

  const foregroundColor = configs.foreground;

  return (
    <View style={[ds.mx14, ds.mt10]}>
      <View style={[ds.relative, ds.roundedFull, dynamicStyles.background(configs.card)]}>
        <View style={[ds.row, ds.justifyBetween, ds.itemsCenter, ds.pl16, ds.pr6, ds.py6]}>
          <View style={[ds.row, ds.shrink, ds.justifyBetween]}>
            <View style={[ds.row, ds.shrink, ds.itemsCenter]}>
              <Pressable style={ds.shrink} onPress={() => navigation.toggleDrawer()}>
                <Icon name="Menu" size={28} />
              </Pressable>
              <Text style={[ds.grow, ds.pl12]} color={foregroundColor} onPress={() => navigation.navigate('Search')}>
                Search
              </Text>
            </View>
            <View style={[ds.row, ds.gap2, ds.mr10]}>
              <Pressable style={ds.p6} onPress={() => navigation.navigate('NotificationStack', { screen: 'Notifications' })}>
                <Icon name="Bell" size={28} />
              </Pressable>
            </View>
          </View>
          <Avatar onPress={() => navigation.navigate('ProfileStack', { screen: 'Profile' })}>
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>{user?.name}</AvatarFallback>
          </Avatar>
        </View>
      </View>
    </View>
  );
}

export default TravelHeader;
