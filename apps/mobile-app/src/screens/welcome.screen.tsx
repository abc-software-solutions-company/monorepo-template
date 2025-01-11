import React from 'react';
import { ds } from '@repo/react-native-design-system';
import StatusBar from '@repo/react-native-ui-core/components/statusbar';
import View from '@repo/react-native-ui-core/components/view';

import SafeViewArea from '@/components/safe-view-area';

import { UnauthenticatedStackProps } from '@/modules/navigation/interfaces/navigation.interface';
import GetStarted from '@/modules/welcome/components/get-started';
import WelcomeSlider from '@/modules/welcome/components/welcome-slider';

function WelcomeScreen({}: UnauthenticatedStackProps<'Welcome'>) {
  return (
    <SafeViewArea>
      <StatusBar visible={false} />
      <View style={[ds.flex1, ds.relative]}>
        <WelcomeSlider />
        <GetStarted />
      </View>
    </SafeViewArea>
  );
}

export default WelcomeScreen;
