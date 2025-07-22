import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, showNavigation = true }) => {
  return (
    <div className="layout">
      <Header showNavigation={showNavigation} />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};