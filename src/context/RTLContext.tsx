import React, { createContext, useContext, useMemo, useState } from 'react';

type RTL = {
  rtl: boolean;
  toggleRTL: () => void;
  rowDirStyle: { flexDirection: 'row' | 'row-reverse' };
  textAlign: 'left' | 'right';
};

const RTLContext = createContext<RTL | null>(null);

export const RTLProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rtl, setRtl] = useState(false);
  const toggleRTL = () => setRtl(prev => !prev);

  const value = useMemo(() => ({
    rtl,
    toggleRTL,
    rowDirStyle: { flexDirection: rtl ? 'row-reverse' : 'row' },
    textAlign: rtl ? 'right' : 'left',
  }), [rtl]);

  return <RTLContext.Provider value={value}>{children}</RTLContext.Provider>;
};

export const useRTL = () => {
  const ctx = useContext(RTLContext);
  if (!ctx) throw new Error('useRTL must be used within RTLProvider');
  return ctx;
};
