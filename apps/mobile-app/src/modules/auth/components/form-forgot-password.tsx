import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { ds } from '@repo/react-native-design-system';
import Button from '@repo/react-native-ui-core/components/button';
import { Form, FormField, FormItem, FormMessage } from '@repo/react-native-ui-core/components/form';
import Input from '@repo/react-native-ui-core/components/input';
import View from '@repo/react-native-ui-core/components/view';

import { ForgotPasswordDto } from '../interfaces/auth.interface';

import { UnauthenticatedNavigationProps } from '@/modules/navigation/interfaces/navigation.interface';

import log from '@/utils/logger.util';

import { forgotPasswordValidator } from '../validators/forgot-password.validator';

const ForgotPasswordForm = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<UnauthenticatedNavigationProps>();

  const defaultValues: ForgotPasswordDto = {
    email: '',
  };

  const form = useForm<ForgotPasswordDto>({ resolver: zodResolver(forgotPasswordValidator), defaultValues });

  const onSubmit: SubmitHandler<ForgotPasswordDto> = async _data => {
    navigation.navigate('VerifyOtp');
    try {
    } catch (error) {
      log.extend('auth').error('Forgot Password Failed', error);
    }
  };

  return (
    <Form {...form}>
      <View>
        <FormField
          name="email"
          control={form.control}
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <Input {...field} error={!!error} placeholder="Email" onChangeText={field.onChange} />
              {error?.message && <FormMessage message={t(error.message, { count: 1, max: 320 })} />}
            </FormItem>
          )}
        />
      </View>
      <View style={ds.mt32}>
        <Button onPress={form.handleSubmit(onSubmit)}>{t('forgot_password_btn')}</Button>
      </View>
    </Form>
  );
};

export default ForgotPasswordForm;
