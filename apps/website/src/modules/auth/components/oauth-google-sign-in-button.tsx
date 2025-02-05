'use client';

import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';

import { useAuthState } from '@/modules/auth/states/auth.state';

const OAuthGoogleSignInButton = ({ ...rest }) => {
  const authState = useAuthState();

  return (
    <Button
      data-testid="btn-signin-google"
      variant="outline"
      onClick={e => {
        e.preventDefault();
        authState.googleSignIn({ redirect: true, callbackUrl: '/' });
      }}
      {...rest}
    >
      Google
    </Button>
  );
};

export default OAuthGoogleSignInButton;
