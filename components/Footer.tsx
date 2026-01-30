import React from 'react';
import { Link } from 'react-router-dom';

// Premium Footer component – appears on every page.
// Uses a dark gradient background, subtle blur, and responsive layout.
// Add any future links or social icons here.
const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-slate-300 py-6 px-4 backdrop-blur-md border-t border-slate-700">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm">
          © {year} JSON Master. All rights reserved.
        </div>
        <nav className="flex gap-4 text-sm">
          <Link to="/" className="hover:text-white transition-colors">Tools</Link>
          <Link to="/json-master" className="hover:text-white transition-colors">JSON Master</Link>
          <Link to="/text-compare" className="hover:text-white transition-colors">Text Compare</Link>
          <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
