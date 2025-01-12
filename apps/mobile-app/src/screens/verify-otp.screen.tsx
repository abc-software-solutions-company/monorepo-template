import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ds } from '@repo/react-native-design-system';
import Heading from '@repo/react-native-ui-core/components/heading';
import Icon from '@repo/react-native-ui-core/components/icon';
import StatusBar from '@repo/react-native-ui-core/components/statusbar';
import Text from '@repo/react-native-ui-core/components/text';

import SafeViewArea from '@/components/safe-view-area';

import VerifyOtpForm from '@/modules/auth/components/form-verify-otp';
import NavigationHeader from '@/modules/navigation/components/navigation-header';
import { UnauthenticatedStackProps } from '@/modules/navigation/interfaces/navigation.interface';

function RegisterScreen({ navigation }: UnauthenticatedStackProps<'VerifyOtp'>) {
  const { t } = useTranslation();

  return (
    <SafeViewArea spacingBottom={true}>
      <StatusBar />
      <NavigationHeader leftFunc={() => navigation.goBack()} leftComponent={<Icon name="ChevronLeft" />} borderColor="transparent" />{' '}
      <KeyboardAvoidingView enabled style={ds.flex1} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView showsVerticalScrollIndicator={false} style={ds.px14}>
          <Heading text={t('verification_otp_title')} style={ds.textCenter} />
          <Text fontWeight="Medium" style={ds.my32}>
            <Trans i18nKey="verification_otp_desc" values={{ email: 'ammodesk@gmail.com' }} components={{ bold: <Text fontWeight="Bold" /> }} />
          </Text>
          <VerifyOtpForm />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeViewArea>
  );
}

export default RegisterScreen;
