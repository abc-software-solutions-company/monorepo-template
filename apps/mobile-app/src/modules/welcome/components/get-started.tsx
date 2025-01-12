import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Colors, ds } from '@repo/react-native-design-system';
import Button from '@repo/react-native-ui-core/components/button';
import Text from '@repo/react-native-ui-core/components/text';
import View from '@repo/react-native-ui-core/components/view';

import { UnauthenticatedNavigationProps } from '@/modules/navigation/interfaces/navigation.interface';

type GetStartedProps = {};

const GetStarted: FC<GetStartedProps> = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<UnauthenticatedNavigationProps>();

  return (
    <View style={[ds.absolute, ds.bottom40, ds.wFull, ds.px14]} testID="get_started">
      <Button size="lg" style={ds.wFull} testID="get_started.button" onPress={() => navigation.navigate('Login')}>
        {t('get_started')}
      </Button>
      <Text color={Colors.white} style={[ds.wFull, ds.textCenter, ds.mt20]} onPress={() => navigation.navigate('Login')}>
        {t('i_already_have_account')}
      </Text>
    </View>
  );
};

export default GetStarted;
