/*
 * @Author: <Tin Tran> (tin.tran@abcdigital.io)
 * @Created: 2025-01-23 11:43:02
 */

'use client';

import { motion } from 'framer-motion';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="grow"
      initial={{ y: 0, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 0, opacity: 0 }}
      transition={{ ease: 'easeInOut', duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}
