import Link from 'next/link';
import React from 'react';

const Footer = () => {
  return (
    <footer className="main-footer">
      <strong>Copyright &copy; 2024 <Link href="/Dashboard">Droompay</Link>. </strong>
      All rights reserved.
    </footer>
  );
};

export default Footer;
