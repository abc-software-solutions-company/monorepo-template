import React from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ds } from '@repo/react-native-design-system';
import Heading from '@repo/react-native-ui-core/components/heading';
import Icon from '@repo/react-native-ui-core/components/icon';
import StatusBar from '@repo/react-native-ui-core/components/statusbar';
import Text from '@repo/react-native-ui-core/components/text';

import Box from '@/components/box';
import SafeViewArea from '@/components/safe-view-area';

import ForgotPasswordForm from '@/modules/auth/components/form-forgot-password';
import NavigationHeader from '@/modules/navigation/components/navigation-header';
import { UnauthenticatedStackProps } from '@/modules/navigation/interfaces/navigation.interface';

function ForgotPasswordScreen({ navigation }: UnauthenticatedStackProps<'ForgotPassword'>) {
  const { t } = useTranslation();

  return (
    <SafeViewArea spacingBottom={true}>
      <StatusBar />
      <NavigationHeader leftFunc={() => navigation.goBack()} leftComponent={<Icon name="ChevronLeft" />} borderColor="transparent" />
      <KeyboardAvoidingView enabled style={ds.flex1} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Box>
            <Heading text={t('forgot_password_title')} style={ds.textCenter} />
            <Text fontWeight="Medium" style={ds.my32}>
              {t('forgot_password_desc')}
            </Text>
            <ForgotPasswordForm />
          </Box>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeViewArea>
  );
}

export default ForgotPasswordScreen;
