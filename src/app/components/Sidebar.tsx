import { faAngleLeft, faCircle, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';

const Sidebar = () => {
  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">

        <a href="/dashboard" className="brand-link">
            <img src="/DroomPay.png" alt="DroomPay Logo" className="brand-image" />
            <span>.</span>
        </a>

      <div className="sidebar">
        {/* SidebarSearch Form */}
        <div className="form-inline">
            <div className="input-group" data-widget="sidebar-search">
                <input className="form-control form-control-sidebar" type="search" placeholder="Search" aria-label="Search" />
                <div className="input-group-append">
                <button className="btn btn-sidebar">
                    <i className="fas fa-search fa-fw"></i>
                </button>
                </div>
            </div>
        </div>

        {/* Sidebar Menu */}
        <nav className="mt-2">
            <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                <li className="nav-item menu-open">
                <a href="#" className="nav-link active" title="Dashboard">
                    <FontAwesomeIcon icon={faTachometerAlt} className="nav-icon" />
                    <span>Dashboard</span>
                    <FontAwesomeIcon icon={faAngleLeft} className="right" />
                </a>
                <ul className="nav nav-treeview">
                    <li className="nav-item">
                    <Link href="/dashboard" className="nav-link sub-nav-link active">
                        <FontAwesomeIcon icon={faCircle} className="nav-icon" />
                        <p>Dashboard</p>
                    </Link>
                    </li>
                </ul>
                </li>
            </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
