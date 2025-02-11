'use client';

import React, { FC } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { cn } from '@repo/react-web-ui-shadcn/lib/utils';

import { usePathname, useRouter } from '@/navigation';

import { PostFilter } from '../interfaces/posts.interface';

type FilterPostByYearProps = {
  className?: string;
  currentYear?: number;
};

const CURRENT_YEAR = new Date().getFullYear();

const FilterPostByYear: FC<FilterPostByYearProps> = ({ className, currentYear }) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ slug: string }>();
  const searchParams = useSearchParams();

  const isCategoryPage = pathname.includes('/category');

  const recentYears = Array.from({ length: CURRENT_YEAR - 2020 + 1 }, (_, i) => CURRENT_YEAR - i);

  const handleClick = (year: number | undefined) => {
    const query = { page: 1 } as PostFilter;

    if (searchParams.get('q')) query.q = searchParams.get('q') as string;
    if (year) query.year = year;

    if (isCategoryPage) {
      router.push({ pathname: '/blog/category/[slug]', params: { slug: params.slug }, query });
    } else {
      router.push({ pathname: '/blog', query });
    }
  };

  if (!recentYears.length) return null;

  return (
    <div className={cn(className)}>
      <h3 className="py-4 text-2xl font-semibold">Archive</h3>
      <div className="grid gap-2">
        <button className={cn('text-left', currentYear === undefined && 'text-primary')} onClick={() => handleClick(undefined)}>
          All years
        </button>
        {recentYears.map(year => (
          <button key={year} className={cn('text-left', currentYear === year && 'text-primary')} onClick={() => handleClick(year)}>
            {year}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterPostByYear;
