import React, { createContext, FC, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

type PortalComponent = ReactNode;
type PortalMap = Map<string, PortalComponent>;

type PortalContextType = {
  addPortal: (name: string, component: PortalComponent) => void;
  removePortal: (name: string) => void;
};

const PortalContext = createContext<PortalContextType>({
  addPortal: () => {},
  removePortal: () => {},
});

type PortalProviderProps = {
  children: ReactNode;
};

export const PortalProvider: FC<PortalProviderProps> = ({ children }) => {
  const [portals, setPortals] = useState<PortalMap>(new Map());

  const addPortal = useCallback((name: string, component: PortalComponent) => {
    setPortals(prev => new Map(prev).set(name, component));
  }, []);

  const removePortal = useCallback((name: string) => {
    setPortals(prev => {
      const newPortals = new Map(prev);

      newPortals.delete(name);

      return newPortals;
    });
  }, []);

  const value = useMemo(() => ({ addPortal, removePortal }), [addPortal, removePortal]);

  return (
    <PortalContext.Provider value={value}>
      {children}
      {Array.from(portals.values())}
    </PortalContext.Provider>
  );
};

export const usePortal = () => useContext(PortalContext);

type PortalProps = {
  children: ReactNode;
  name?: string;
};

const generateUniqueId = (() => {
  let id = 0;

  return () => `portal-${id++}`;
})();

export const Portal: FC<PortalProps> = ({ children, name }) => {
  const { addPortal, removePortal } = usePortal();
  const portalName = useRef(name || generateUniqueId());

  useEffect(() => {
    addPortal(portalName.current, children);

    return () => removePortal(portalName.current);
  }, [children, addPortal, removePortal]);

  return null;
};
