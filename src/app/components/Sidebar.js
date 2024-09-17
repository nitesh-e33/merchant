import { usePathname } from 'next/navigation';
import { faAngleLeft, faCircle, faSearch, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';

const Sidebar = () => {
  const pathname = usePathname() || '';
  const isActive = (path) => pathname.startsWith(path);

  // Retrieve user services from local storage
  const user = JSON.parse(localStorage.getItem('user'));
  const userServices = user?.services ? Object.values(user.services) : [];

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      <a href="/dashboard" className="brand-link">
        <img src="/DroomPay.png" alt="DroomPay Logo" className="brand-image" />
      </a>

      <div className="sidebar">
        {/* SidebarSearch Form */}
        <div className="form-inline">
          <div className="input-group" data-widget="sidebar-search">
            <input className="form-control form-control-sidebar" type="search" placeholder="Search" aria-label="Search" />
            <div className="input-group-append">
              <button className="btn btn-sidebar">
                <FontAwesomeIcon icon={faSearch} className="nav-icon" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Menu */}
        <nav className="mt-2">
          <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
            <li className={`nav-item ${isActive('/dashboard') ? 'menu-open' : ''}`}>
              <a href="#" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`} title="Dashboard">
                <FontAwesomeIcon icon={faTachometerAlt} className="nav-icon" />
                <span>Dashboard</span>
                <FontAwesomeIcon icon={faAngleLeft} className="right" />
              </a>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link href="/dashboard" className={`nav-link sub-nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
                    <FontAwesomeIcon icon={faCircle} className="nav-icon" />
                    <p>Dashboard</p>
                  </Link>
                </li>
              </ul>
            </li>

            <li className={`nav-item ${isActive('/transactions') ? 'menu-open' : ''}`}>
              <a href="#" className={`nav-link ${isActive('/transactions') ? 'active' : ''}`} title="Transaction">
                <FontAwesomeIcon icon={faTachometerAlt} className="nav-icon" />
                <span>Transaction</span>
                <FontAwesomeIcon icon={faAngleLeft} className="right" />
              </a>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link href="/transactions" className={`nav-link sub-nav-link ${isActive('/transactions') ? 'active' : ''}`}>
                    <FontAwesomeIcon icon={faCircle} className="nav-icon" />
                    <p>Transaction List</p>
                  </Link>
                </li>
              </ul>
            </li>

            <li className={`nav-item ${isActive('/refunds') ? 'menu-open' : ''}`}>
              <a href="#" className={`nav-link ${isActive('/refunds') ? 'active' : ''}`} title="Refund">
                <FontAwesomeIcon icon={faTachometerAlt} className="nav-icon" />
                <span>Refund</span>
                <FontAwesomeIcon icon={faAngleLeft} className="right" />
              </a>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link href="/refunds" className={`nav-link sub-nav-link ${isActive('/refunds') ? 'active' : ''}`}>
                    <FontAwesomeIcon icon={faCircle} className="nav-icon" />
                    <p>Refund List</p>
                  </Link>
                </li>
              </ul>
            </li>

            {/* Conditionally render Auto Debit panel */}
            {userServices.includes('AD') && (
              <li className={`nav-item ${isActive('/directdebit') ? 'menu-open' : ''}`}>
                <a href="#" className={`nav-link ${isActive('/directdebit') ? 'active' : ''}`} title="Auto Debit">
                <FontAwesomeIcon icon={faTachometerAlt} className="nav-icon" />
                  <span>Auto Debit</span>
                  <FontAwesomeIcon icon={faAngleLeft} className="right" />
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <Link href="/directdebit/authorization" className={`nav-link sub-nav-link ${isActive('/directdebit/authorization') ? 'active' : ''}`}>
                      <FontAwesomeIcon icon={faCircle} className="nav-icon" />
                      <p>Authorization</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/directdebit/debitrequests" className={`nav-link sub-nav-link ${isActive('/directdebit/debitrequests') ? 'active' : ''}`}>
                      <FontAwesomeIcon icon={faCircle} className="nav-icon" />
                      <p>Customer Requests</p>
                    </Link>
                  </li>
                </ul>
              </li>
            )}

            {/* Conditionally render Easy Collect panel */}
            {userServices.includes('EC') && (
              <li className={`nav-item ${isActive('/easycollect') ? 'menu-open' : ''}`}>
                <a href="#" className={`nav-link ${isActive('/easycollect') ? 'active' : ''}`} title="Easy Collect">
                <FontAwesomeIcon icon={faTachometerAlt} className="nav-icon" />
                  <span>Easy Collect</span>
                  <FontAwesomeIcon icon={faAngleLeft} className="right" />
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <Link href="/easycollect" className={`nav-link sub-nav-link ${isActive('/easycollect') ? 'active' : ''}`}>
                      <FontAwesomeIcon icon={faCircle} className="nav-icon" />
                      <p>Easy Collect List</p>
                    </Link>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
