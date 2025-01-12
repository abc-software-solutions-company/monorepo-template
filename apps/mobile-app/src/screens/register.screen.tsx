import React from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ds } from '@repo/react-native-design-system';
import Heading from '@repo/react-native-ui-core/components/heading';
import Icon from '@repo/react-native-ui-core/components/icon';
import Separator from '@repo/react-native-ui-core/components/separator';
import StatusBar from '@repo/react-native-ui-core/components/statusbar';
import Text from '@repo/react-native-ui-core/components/text';
import View from '@repo/react-native-ui-core/components/view';
import { useCoreUITheme } from '@repo/react-native-ui-core/themes/theme.context';

import Box from '@/components/box';
import SafeViewArea from '@/components/safe-view-area';

import AppleSignIn from '@/modules/auth/components/apple-sign-in';
import FacebookSignIn from '@/modules/auth/components/facebook-sign-in';
import RegisterForm from '@/modules/auth/components/form-register';
import GoogleSignIn from '@/modules/auth/components/google-sign-in';
import NavigationHeader from '@/modules/navigation/components/navigation-header';
import { UnauthenticatedStackProps } from '@/modules/navigation/interfaces/navigation.interface';

function RegisterScreen({ navigation }: UnauthenticatedStackProps<'Register'>) {
  const { t } = useTranslation();
  const { configs } = useCoreUITheme();

  return (
    <SafeViewArea spacingBottom={true}>
      <StatusBar />
      <NavigationHeader leftFunc={() => navigation.goBack()} leftComponent={<Icon name="ChevronLeft" />} borderColor="transparent" />
      <KeyboardAvoidingView enabled style={ds.flex1} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Box>
            <Heading text={t('signup_title')} style={ds.textCenter} />
            <View style={[ds.row, ds.itemsCenter, ds.justifyCenter, ds.mt32, ds.gap14]}>
              <GoogleSignIn style={ds.px14} />
              <FacebookSignIn style={ds.px14} />
              <AppleSignIn style={ds.px14} />
            </View>
            <View style={[ds.itemsCenter, ds.justifyCenter, ds.mt44, ds.mb20]}>
              <Separator />
              <Text color={configs.foreground} style={[ds.textCenter, ds.mt24ne, ds.p10, { backgroundColor: configs.background }]} fontWeight="Bold">
                {t('or_continue_with_password')}
              </Text>
            </View>
            <RegisterForm />
            <View style={[ds.row, ds.itemsCenter, ds.justifyCenter, ds.mt32]}>
              <Text>{t('already_have_account')}</Text>
              <Text fontWeight="Bold" style={ds.ml4} onPress={() => navigation.navigate('Login')}>
                {t('signin')}
              </Text>
            </View>
          </Box>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeViewArea>
  );
}

export default RegisterScreen;
