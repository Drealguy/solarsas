'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface ActivationContextType {
  isActive: boolean;
  activate: () => void;
}

const ActivationContext = createContext<ActivationContextType>({
  isActive: false,
  activate: () => {},
});

export function ActivationProvider({ children }: { children: React.ReactNode }) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(localStorage.getItem('solarsas_active') === 'true');
  }, []);

  function activate() {
    localStorage.setItem('solarsas_active', 'true');
    setIsActive(true);
  }

  return (
    <ActivationContext.Provider value={{ isActive, activate }}>
      {children}
    </ActivationContext.Provider>
  );
}

export const useActivation = () => useContext(ActivationContext);
