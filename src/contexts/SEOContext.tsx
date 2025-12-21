import React, { createContext, useContext, ReactNode } from 'react';
import { useSEO, SEOSettings, PageSEO } from '../hooks/useSEO';

interface SEOContextType {
  seoSettings: SEOSettings | null;
  loading: boolean;
  getPageSEO: (pageKey: string) => Promise<PageSEO | null>;
  updateSEOSettings: (settings: Partial<SEOSettings>) => Promise<boolean>;
  updatePageSEO: (pageKey: string, seoData: Partial<PageSEO>) => Promise<boolean>;
  reloadSettings: () => Promise<void>;
}

const SEOContext = createContext<SEOContextType | undefined>(undefined);

export const SEOProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const seoHook = useSEO();

  return (
    <SEOContext.Provider value={seoHook}>
      {children}
    </SEOContext.Provider>
  );
};

export const useSEOContext = () => {
  const context = useContext(SEOContext);
  if (context === undefined) {
    throw new Error('useSEOContext must be used within a SEOProvider');
  }
  return context;
};
