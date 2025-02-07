'use client';

import { useTranslations } from 'next-intl';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormFieldInput from '@repo/react-web-ui-shadcn/components/form-fields/form-field-input';
import FormFieldInputPassword from '@repo/react-web-ui-shadcn/components/form-fields/form-field-input-password';
import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';
import { Form } from '@repo/react-web-ui-shadcn/components/ui/form';

import { Link } from '@/navigation';

import { SignUpDto } from '../interfaces/auth.interface';

import { useAuthState } from '@/modules/auth/states/auth.state';

import OAuthFacebookSignInButton from './oauth-facebook-sign-in-button';
import OAuthGoogleSignInButton from './oauth-google-sign-in-button';

import { signUpValidator } from '../validators/sign-up.validator';

const FormSignUp = () => {
  const t = useTranslations();
  const authState = useAuthState();

  const defaultValues: SignUpDto = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const form = useForm<SignUpDto>({ resolver: zodResolver(signUpValidator), defaultValues });

  const onSubmit: SubmitHandler<SignUpDto> = async formData => {
    delete formData.confirmPassword;

    authState.signIn({ ...formData, redirect: true, callbackUrl: '/' });
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-xl">
        <Form {...form}>
          <form data-testid="frm-sign-up" className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome</h1>
                <p className="text-balance text-muted-foreground">Create an account</p>
              </div>
              <div className="grid gap-4">
                <FormFieldInput form={form} fieldName="name" formLabel="Name" labelDisplay="outside" size="sm" translator={t} />
                <FormFieldInput form={form} fieldName="email" formLabel="Email" labelDisplay="outside" size="sm" translator={t} />
                <FormFieldInputPassword
                  form={form}
                  formLabel={t('form_field_password')}
                  fieldName="password"
                  labelDisplay="outside"
                  size="sm"
                  translator={t}
                />
                <FormFieldInputPassword
                  form={form}
                  formLabel={t('form_field_confirm_password')}
                  fieldName="confirmPassword"
                  labelDisplay="outside"
                  size="sm"
                  translator={t}
                />

                <Button className="w-full" type="submit">
                  {t('signup')}
                </Button>
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <OAuthGoogleSignInButton />
                  <OAuthFacebookSignInButton />
                </div>
                <div className="text-center text-sm">
                  <span>Already have an account?</span> <Link href="/sign-in">Sign in</Link>
                </div>
              </div>
            </div>
            <div className="mt-6 text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
              <Link href="/terms-and-conditions">Terms of Service</Link> and <Link href="/terms-and-conditions">Privacy Policy</Link>.
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default FormSignUp;
