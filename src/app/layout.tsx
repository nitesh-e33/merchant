'use client'
import React from 'react';
import { usePathname } from 'next/navigation';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import '../styles/globals.css';
import '../js/globals.js'
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isLoginPage = pathname === '/' || pathname === '/forgotpassword';

  return (
    <html lang="en">
      <head>
        <title>Merchant Panel</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
        />
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
        <ToastContainer 
          position="top-right" 
          autoClose={3000} 
          hideProgressBar={false} 
          newestOnTop={false} 
          closeOnClick 
          rtl={false} 
          pauseOnFocusLoss 
          draggable 
          pauseOnHover 
        />
      </body>
    </html>
  );
};

export default RootLayout;