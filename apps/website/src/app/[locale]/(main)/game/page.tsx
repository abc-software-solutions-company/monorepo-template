import { Metadata } from 'next';

import { LayoutProps } from '@/interfaces/layout.interface';
import { PageBaseProps } from '@/interfaces/page.interface';

import Game from '@/modules/game/components/game';

export default async function GamePage(_pageProps: PageBaseProps) {
  return (
    <div className="grow">
      <h3>Game</h3>
      <Game />
    </div>
  );
}

export async function generateMetadata({ params: { locale } }: LayoutProps): Promise<Metadata> {
  return {
    title: 'Game',
    description: 'Game Description',
    alternates: {
      canonical: `/${locale}/game`,
    },
  };
}
