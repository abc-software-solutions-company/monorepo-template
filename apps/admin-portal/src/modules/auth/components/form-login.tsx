import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@repo/react-web-ui-shadcn/components/ui/form';
import { Input } from '@repo/react-web-ui-shadcn/components/ui/input';
import { useMutation } from '@tanstack/react-query';

import { SignInDto } from '../interfaces/auth.interface';

import { useAuthState } from '@/modules/auth/states/auth.state';

import AuthApi from '../api/auth.api';
import { signInValidator } from '../validators/sign-in.validator';

const LoginForm = () => {
  const t = useTranslations();
  const authState = useAuthState();

  const defaultValues: SignInDto = {
    email: '',
    password: '',
  };

  const form = useForm<SignInDto>({ resolver: zodResolver(signInValidator), defaultValues });

  const mutation = useMutation({
    mutationFn: async (signInDto: SignInDto) => AuthApi.signIn(signInDto),
    onSuccess: resp => {
      const { user, accessToken } = resp.data.data;

      authState.setAuthenticated(true);
      authState.setAccessToken(accessToken);
      authState.setUser(user);
    },
    onError: error => {
      toast(t('signin_error'), {
        description: `danger<br />${error.message}`,
      });
    },
  });

  const onSubmit: SubmitHandler<SignInDto> = async formData => mutation.mutate(formData);

  return (
    <div className="flex h-full grow items-center justify-center" data-testid="frm-login">
      <Form {...form}>
        <form className="relative w-full max-w-sm self-center overflow-hidden rounded-xl bg-muted p-6" onSubmit={form.handleSubmit(onSubmit)}>
          {/* Logo */}
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-bold">{t('login')}</h1>
          </div>
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState: { error } }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                {error?.message && <FormMessage message={t(error.message, { min: 1, max: 320 })} />}
              </FormItem>
            )}
          />
          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState: { error } }) => (
              <FormItem className="mt-3">
                <FormLabel>{t('password')}</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                {error?.message && <FormMessage message={t(error.message, { min: 8, max: 255 })} />}
              </FormItem>
            )}
          />
          {/* Submit */}
          <div className="mt-6">
            <Button className="w-full" type="submit">
              {t('login')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
