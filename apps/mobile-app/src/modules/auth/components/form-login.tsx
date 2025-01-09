import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useToast } from 'react-native-toast-notifications';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { ds } from '~react-native-design-system';
import Button from '~react-native-ui-core/components/button';
import { Form, FormField, FormItem, FormMessage } from '~react-native-ui-core/components/form';
import Input from '~react-native-ui-core/components/input';
import InputPassword from '~react-native-ui-core/components/input-password';
import View from '~react-native-ui-core/components/view';

import { SignInDto } from '../interfaces/auth.interface';

import log from '@/utils/logger.util';

import AuthApi from '../api/auth.api';
import { useAuthState } from '../states/auth.state';
import { signInValidator } from '../validators/sign-in.validator';

const LoginForm = () => {
  const toast = useToast();
  const { t } = useTranslation();
  const authState = useAuthState();

  const defaultValues: SignInDto = {
    email: 'mrkilobyte@gmail.com',
    password: 'Ammodesk123@',
  };

  const form = useForm<SignInDto>({ resolver: zodResolver(signInValidator), defaultValues });
  const mutation = useMutation({
    mutationFn: async (signInDto: SignInDto) => AuthApi.passwordSignIn(signInDto),
    onSuccess: resp => {
      authState.setAuthenticated(true);
      authState.setAccessToken(resp.data.data.accessToken);
      authState.setUser(resp.data.data.user);
      log.extend('auth').info('Login Password Success');
    },
    onError: error => {
      toast.show(t('signin_error'), { type: 'danger' });
      log.extend('auth').error('Login Password Failed', error);
    },
  });

  const onSubmit: SubmitHandler<SignInDto> = async formData => mutation.mutate(formData);

  return (
    <Form {...form}>
      <View style={ds.gap20}>
        <View>
          <FormField
            name="email"
            control={form.control}
            render={({ field, fieldState: { error } }) => (
              <FormItem>
                <Input {...field} error={!!error} placeholder={t('signin_email')} onChangeText={field.onChange} />
                {error?.message && <FormMessage message={t(error.message, { count: 1, max: 320 })} />}
              </FormItem>
            )}
          />
        </View>
        <View>
          <FormField
            name="password"
            control={form.control}
            render={({ field, fieldState: { error } }) => (
              <FormItem>
                <InputPassword {...field} error={!!error} placeholder={t('signin_password')} onChangeText={field.onChange} />
                {error?.message && <FormMessage message={t(error.message, { count: 8, max: 255 })} />}
              </FormItem>
            )}
          />
        </View>
        <View>
          <Button loading={mutation.isPending} disabled={mutation.isPending} onPress={form.handleSubmit(onSubmit)}>
            {t('signin')}
          </Button>
        </View>
      </View>
    </Form>
  );
};

export default LoginForm;
