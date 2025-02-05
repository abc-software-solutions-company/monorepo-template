/*
 * @Author: <Tin Tran> (tin.tran@abcdigital.io)
 * @Created: 2025-01-23 11:45:47
 */

'use client';

import { useContext, useRef } from 'react';
import { LayoutRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { usePathname, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

function FrozenRouter(props: { children: React.ReactNode }) {
  const context = useContext(LayoutRouterContext ?? {});
  const frozen = useRef(context).current;

  if (!frozen) {
    return <>{props.children}</>;
  }

  return <LayoutRouterContext.Provider value={frozen}>{props.children}</LayoutRouterContext.Provider>;
}

const variants = {
  hidden: { y: 0, opacity: 0 },
  enter: { y: 0, opacity: 1 },
  exit: { y: 0, opacity: 0 },
};

const PageTransitionEffect = ({ children }: { children: React.ReactNode }) => {
  const key = usePathname();
  const [searchParams] = useSearchParams();

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={key + searchParams?.toString()}
        className="grow"
        initial="hidden"
        animate="enter"
        exit="exit"
        variants={variants}
        transition={{ ease: 'easeInOut', duration: 1 }}
      >
        <FrozenRouter>{children}</FrozenRouter>
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransitionEffect;
