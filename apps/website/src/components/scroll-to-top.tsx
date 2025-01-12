'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { debounce } from 'lodash-es';
import { ChevronsUpIcon } from 'lucide-react';
import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';
import useScrollTo from '@repo/shared-web/hooks/use-scroll-to';

type ScrollToTopProps = {
  offset?: number;
};

export function ScrollToTop({ offset = 100 }: ScrollToTopProps) {
  const scrollTo = useScrollTo();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = debounce(() => {
      if (window.scrollY > offset) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    }, 250);

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, [offset]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-8 right-8 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Button className="h-10 w-10 p-0" onClick={() => scrollTo.top()}>
            <ChevronsUpIcon size={18} />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ScrollToTop;
