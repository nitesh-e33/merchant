import { faBars, faUser, faCog, faSignOutAlt, faExpandArrowsAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiRequest } from '../lib/apiHelper';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const Header = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await apiRequest('GET', '/v1/merchant/logout');
      if (response.StatusCode === '1') {
        localStorage.removeItem('user');
        toast.success(response.Message);
        router.push('/');
      } else {
        toast.error(response.Message);
      }
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  const merchantSetting = (event) => {
    const isKYCVerified = event.currentTarget.getAttribute('data-is-verified');
    if (isKYCVerified !== "true") {
      toast.error('Your Profile is Under Verification.');
      return;
    }

    router.push('/settings');
  };

  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link className="nav-link" data-widget="pushmenu" href="#" role="button">
            <FontAwesomeIcon icon={faBars} />
          </Link>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          <Link href="/" passHref className="nav-link">Home</Link>
        </li>
      </ul>

      <ul className="navbar-nav ml-auto">
        {user && (
          <li className="nav-item dropdown">
            <Link className="nav-link" data-bs-toggle="dropdown" href="#" role="button">
              <FontAwesomeIcon icon={faUser} /> {user.name}
            </Link>
            <div className="dropdown-menu dropdown-menu-end">
              <span className="dropdown-item dropdown-header">User Profile</span>
              <div className="dropdown-divider"></div>
              <Link href="/my-account" passHref className="dropdown-item">
                <FontAwesomeIcon icon={faUser} className="mr-2" /> My Account
              </Link>
              <button onClick={merchantSetting} className="dropdown-item merchant-setting" type="button" data-is-verified={user.isKYCVerified}>
                <FontAwesomeIcon icon={faCog} className="mr-2" /> Settings
              </button>
              <button onClick={handleLogout} className="dropdown-item">
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Logout
              </button>
            </div>
          </li>
        )}
        <li className="nav-item">
          <a className="nav-link" data-widget="fullscreen" href="#" role="button">
            <FontAwesomeIcon icon={faExpandArrowsAlt} />
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
