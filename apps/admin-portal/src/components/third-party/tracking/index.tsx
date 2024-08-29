import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Tracker from './utils/tracker';
import GtagScript from './gtag';
import SegmentScript from './segment';

const Tracking = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    Tracker.page(window.location.pathname);
  }, [pathname]);

  return (
    <>
      <GtagScript />
      <SegmentScript />
    </>
  );
};

export default Tracking;
