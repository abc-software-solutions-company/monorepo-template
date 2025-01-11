import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { PERMISSIONS, request } from 'react-native-permissions';
import { useNavigation } from '@react-navigation/native';
import { ds } from '@repo/react-native-design-system';
import Button from '@repo/react-native-ui-core/components/button';
import Icon from '@repo/react-native-ui-core/components/icon';
import StatusBar from '@repo/react-native-ui-core/components/statusbar';
import View from '@repo/react-native-ui-core/components/view';

import SafeViewArea from '@/components/safe-view-area';

import NavigationHeader from '@/modules/navigation/components/navigation-header';
import { AuthenticatedStackProps } from '@/modules/navigation/interfaces/navigation.interface';
import { getHeaderTitle } from '@/modules/navigation/utils/navigation.util';
// import GoogleMLKitScanner from '@/modules/scancode/components/google-ml-kit-scanner';

function ScanCodeScreen({ route }: AuthenticatedStackProps<'ScanCode'>) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [permissionResult, setPermissionResult] = useState('Not asked');

  useEffect(() => {
    request(Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA).then(result => {
      setPermissionResult(result);
    });
  }, []);

  return (
    <SafeViewArea>
      <StatusBar />
      <NavigationHeader title={t(getHeaderTitle(route.name))} leftFunc={() => navigation.goBack()} leftComponent={<Icon name="ChevronLeft" />} />
      <View style={ds.flex1}>
        {permissionResult === 'granted' && <View style={ds.grow}>{/* <GoogleMLKitScanner /> */}</View>}
        {permissionResult === 'blocked' && <Button onPress={() => navigation.goBack()}>Back</Button>}
      </View>
    </SafeViewArea>
  );
}

export default ScanCodeScreen;
