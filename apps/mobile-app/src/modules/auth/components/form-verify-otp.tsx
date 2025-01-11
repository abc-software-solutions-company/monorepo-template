import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import InputOTP from '@repo/react-native-ui-core/components/input-otp';
import View from '@repo/react-native-ui-core/components/view';

import { UnauthenticatedNavigationProps } from '@/modules/navigation/interfaces/navigation.interface';

const MAXIMUM_CODE_LENGTH = 5;

const VerifyOtpForm = () => {
  const [otpCode, setOTPCode] = useState('');
  const [isPinReady, setIsPinReady] = useState(false);
  const navigation = useNavigation<UnauthenticatedNavigationProps>();

  useEffect(() => {
    if (isPinReady) {
      navigation.navigate('ResetPassword');
    }
  }, [navigation, isPinReady]);

  return (
    <View>
      <InputOTP code={otpCode} maximumLength={MAXIMUM_CODE_LENGTH} setCode={setOTPCode} setIsPinReady={setIsPinReady} />
    </View>
  );
};

export default VerifyOtpForm;
