'use client'
import React from 'react';
import { usePathname } from 'next/navigation';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import '../styles/globals.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;
import '../js/adminlte.min.js'

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isLoginPage = pathname === '/';

  return (
    <html lang="en">
      <head>
        <title>Admin Panel</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="/js/adminlte.min.js" defer></script>
      </head>
      <body className="hold-transition sidebar-mini layout-fixed">
        {!isLoginPage ? (
          <div className="wrapper">
            <Header />
            <Sidebar />
            <div className="content-wrapper">
              <section className="content">
                <div className="container-fluid">
                  {children}
                </div>
              </section>
            </div>
            <Footer />
          </div>
        ) : (
          <div>{children}</div>
        )}
      </body>
    </html>
  );
};

export default RootLayout;