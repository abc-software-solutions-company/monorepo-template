import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { ds } from '@repo/react-native-design-system';
import Button from '@repo/react-native-ui-core/components/button';
import { Form, FormField, FormItem, FormMessage } from '@repo/react-native-ui-core/components/form';
import Input from '@repo/react-native-ui-core/components/input';
import View from '@repo/react-native-ui-core/components/view';

import { UserFormData } from '@/modules/users/interfaces/users.interface';

import { signUpValidator } from '../validators/sign-up.validator';

type FormData = UserFormData & {
  confirmPassword?: string;
};

const RegisterForm = () => {
  const { t } = useTranslation();

  const defaultValues = {
    name: 'Tin Tran',
    email: 'tindl88@gmail.com',
    password: 'Tintran123@',
    confirmPassword: 'Tintran123@',
  } as FormData;

  const form = useForm<FormData>({ resolver: zodResolver(signUpValidator), defaultValues });

  const onSubmit: SubmitHandler<FormData> = async data => {
    try {
      delete data.confirmPassword;
    } catch (error) {}
  };

  return (
    <Form {...form}>
      <View>
        <FormField
          name="name"
          control={form.control}
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <Input {...field} placeholder="Name" error={!!error} onChangeText={field.onChange} />
              {error?.message && <FormMessage message={t(error.message, { count: 1, max: 255 })} />}
            </FormItem>
          )}
        />
      </View>
      <View style={ds.mt14}>
        <FormField
          name="email"
          control={form.control}
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <Input {...field} placeholder="Email" error={!!error} onChangeText={field.onChange} />
              {error?.message && <FormMessage message={t(error.message, { count: 1, max: 320 })} />}
            </FormItem>
          )}
        />
      </View>
      <View style={ds.mt14}>
        <FormField
          name="password"
          control={form.control}
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <Input {...field} placeholder={t('password')} error={!!error} onChangeText={field.onChange} />
              {error?.message && <FormMessage message={t(error.message, { count: 8, max: 255 })} />}
            </FormItem>
          )}
        />
      </View>
      <View style={ds.mt14}>
        <FormField
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <Input {...field} placeholder={t('confirm_password')} error={!!error} onChangeText={field.onChange} />
              {error?.message && <FormMessage message={t(error.message, { count: 8, max: 255 })} />}
            </FormItem>
          )}
        />
      </View>
      <View style={ds.mt32}>
        <Button onPress={form.handleSubmit(onSubmit)}>{t('create_account')}</Button>
      </View>
    </Form>
  );
};

export default RegisterForm;
