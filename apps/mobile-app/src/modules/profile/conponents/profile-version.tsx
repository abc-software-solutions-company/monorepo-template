import React, { FC } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import VersionCheck from 'react-native-version-check';
import { ds } from '@repo/react-native-design-system';
import Text from '@repo/react-native-ui-core/components/text';
import View from '@repo/react-native-ui-core/components/view';

type ProfileVersionProps = {
  style?: StyleProp<ViewStyle>;
};

const ProfileVersion: FC<ProfileVersionProps> = ({ style }) => {
  const buildNumber = VersionCheck.getCurrentBuildNumber();
  const version = VersionCheck.getCurrentVersion();

  return (
    <View style={[ds.itemsCenter, style]}>
      <Text>{`Bully - ${version} build ${buildNumber}`}</Text>
    </View>
  );
};

export default ProfileVersion;
