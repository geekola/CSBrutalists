import React, { createContext, useContext, useState } from 'react';

type AdminView = 'portfolio' | 'resume';

interface AdminContextType {
  currentView: AdminView;
  setCurrentView: (view: AdminView) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AdminView>('portfolio');

  return (
    <AdminContext.Provider value={{ currentView, setCurrentView }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
