import { Noto_Sans } from 'next/font/google';
import { getServerSession } from 'next-auth';
import classNames from 'classnames';

import { LayoutProps } from '@/interfaces/layout.interface';

import Footer from '@/components/footers/footer';
import TopBar from '@/components/headers/topbar';
import Body from '@/components/layout/body';
import Head from '@/components/layout/head';
import Html from '@/components/layout/html';
import Root from '@/components/layout/root';
import ScrollToTop from '@/components/scroll-to-top';

import { authOptions } from '@/modules/auth/constants/auth.constant';

const fontNotoSans = Noto_Sans({
  subsets: ['vietnamese'],
  variable: '--font-notosans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export default async function AuthLayout({ children, params }: LayoutProps) {
  const session = await getServerSession(authOptions);

  return (
    <Html locale={params.locale} className={session?.user?.preference?.theme}>
      <Head />
      <Body className={classNames(fontNotoSans.variable, session?.user?.preference?.themeColor, 'font-notosans')}>
        <Root className="relative">
          <TopBar userSession={session} />
          {children}
          <Footer />
          <ScrollToTop />
        </Root>
      </Body>
    </Html>
  );
}
