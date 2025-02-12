/*
 * @Author: <Tin Tran> (tin.tran@abcdigital.io)
 * @Created: 2025-02-11 15:22:10
 */

'use client';

import { FC } from 'react';
import { cn } from '@repo/react-web-ui-shadcn/lib/utils';

type SanitizedHTMLProps = {
  className?: string;
  html: string;
};

const SanitizedHTML: FC<SanitizedHTMLProps> = ({ className, html }) => {
  return <div className={cn('wysiwyg prose', className)} dangerouslySetInnerHTML={{ __html: html }} />;
};

export default SanitizedHTML;
