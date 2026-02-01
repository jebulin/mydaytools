import React from 'react';
import { Link } from 'react-router-dom';
import { FileCode2, Github, Twitter, Mail, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-12 pb-6 px-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <FileCode2 className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">My Day Tools</span>
            </div>
            <p className="text-slate-600 dark:text-slate-500 text-sm leading-relaxed mb-6">
              A premium suite of free online tools for developers. Fast, private, and secure by design.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://github.com/jebulin?tab=repositories" className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all">
                <Github size={18} />
              </a>

              <a href="https://www.instagram.com/jebulin_dev/" className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Tools Column */}
          <div className="md:col-span-1">
            <h4 className="text-slate-900 dark:text-white font-bold mb-4 uppercase tracking-wider text-xs">Utilities</h4>
            <ul className="space-y-3">
              <li><Link to="/json-master" className="text-slate-600 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">JSON Formatter</Link></li>
              <li><Link to="/text-compare" className="text-slate-600 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">Text Compare</Link></li>
              <li><Link to="/encode-decode" className="text-slate-600 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">Encode & Decode</Link></li>
              <li><Link to="/" className="text-slate-600 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">All Tools</Link></li>
            </ul>
          </div>

          {/* Media Column */}
          {/* <div className="md:col-span-1">
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Resources</h4>
            <ul className="space-y-3">
              <li><Link to="/blog" className="text-slate-500 hover:text-blue-400 text-sm transition-colors">Developer Blog</Link></li>
              <li><a href="#" className="text-slate-500 hover:text-blue-400 text-sm transition-colors">API Docs</a></li>
              <li><a href="#" className="text-slate-500 hover:text-blue-400 text-sm transition-colors">Release Notes</a></li>
              <li><a href="#" className="text-slate-500 hover:text-blue-400 text-sm transition-colors">Open Source</a></li>
            </ul>
          </div> */}

          {/* Legal Column */}
          <div className="md:col-span-1">
            <h4 className="text-slate-900 dark:text-white font-bold mb-4 uppercase tracking-wider text-xs">Legal</h4>
            <ul className="space-y-3">
              <li><Link to="/privacy-policy" className="text-slate-600 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-slate-600 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookie-policy" className="text-slate-600 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 transition-colors">
          <p className="text-slate-500 dark:text-slate-600 text-[10px] uppercase tracking-[0.2em] font-bold">
            © {year} MY DAY TOOLS • PRIVACY FOCUSED UTILITIES
          </p>
          <div className="flex items-center gap-6">
            <span className="text-slate-500 dark:text-slate-600 text-[10px] uppercase tracking-[0.2em] font-bold">Local processing • No data sent to server</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
