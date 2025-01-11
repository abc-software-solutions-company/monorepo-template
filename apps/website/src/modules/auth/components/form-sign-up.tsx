'use client';

import { useTranslations } from 'next-intl';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';
import { Form } from '@repo/react-web-ui-shadcn/components/ui/form';
import { Loading } from '@repo/react-web-ui-shadcn/components/ui/loading';

import { SignUpDto } from '../interfaces/auth.interface';

import FormFieldInputEmail from '@/components/form-fields/form-field-input-email';
import FormFieldInputName from '@/components/form-fields/form-field-input-name';
import FormFieldInputPassword from '@/components/form-fields/form-field-input-password';
import Logo from '@/components/icons/logo';

import { useAuthState } from '@/modules/auth/states/auth.state';

import OAuthFacebookSignInButton from './oauth-facebook-sign-in-button';
import OAuthGoogleSignInButton from './oauth-google-sign-in-button';

import { signInValidator } from '../validators/sign-in.validator';

const FormSignUp = () => {
  const t = useTranslations();
  const authState = useAuthState();

  const defaultValues: SignUpDto = {
    name: 'Ammodesk',
    email: 'ammodesk@gmail.com',
    password: 'Ammodesk123@',
    confirmPassword: 'Ammodesk123@',
  };

  const form = useForm<SignUpDto>({ resolver: zodResolver(signInValidator), defaultValues });

  const onSubmit: SubmitHandler<SignUpDto> = async formData => {
    delete formData.confirmPassword;

    authState.signIn({ ...formData, redirect: true, callbackUrl: '/' });
  };

  return (
    <div className="flex h-full grow items-center justify-center" data-testid="frm-signup">
      <Form {...form}>
        <form className="relative w-full max-w-sm self-center overflow-hidden rounded-xl p-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="absolute left-0 top-0 -z-10 h-full w-full bg-slate-400 opacity-30"></div>
          {/* Logo */}
          <div className="flex justify-center">
            <Logo width={60} />
          </div>
          <FormFieldInputName form={form} />
          <FormFieldInputEmail form={form} />
          <FormFieldInputPassword form={form} />
          <FormFieldInputPassword form={form} formLabel="Confirm Password" fieldName="confirmPassword" />
          {/* Submit */}
          <div className="mt-6">
            <Button className="w-full" type="submit">
              <Loading size="icon" thickness={2} />
              {t('signin')}
            </Button>
          </div>
          {/* OAuth */}
          <div className="flex items-center justify-center space-x-3">
            <OAuthGoogleSignInButton />
            <OAuthFacebookSignInButton />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormSignUp;
