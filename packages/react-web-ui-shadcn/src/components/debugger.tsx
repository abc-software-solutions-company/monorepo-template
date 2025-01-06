/*
 * @Author: <Tin Tran> (tin.tran@abcdigital.io)
 * @Created: 2024-12-31 22:27:23
 */

import { FC } from 'react';

type DebuggerProps = {
  text: string;
};

const Debugger: FC<DebuggerProps> = ({ text }) => {
  const isDebugMode = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('debug') === '1' : false;

  if (!isDebugMode) {
    return null;
  }

  return <pre className="rounded-md bg-amber-100 p-2 text-xs text-black">{text}</pre>;
};

export default Debugger;
