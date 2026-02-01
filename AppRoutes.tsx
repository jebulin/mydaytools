import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Blog from './components/Blog';
import BlogDetail from './components/BlogDetail';
import TextCompareHome from './components/TextCompareHome';
import Dashboard from './components/Dashboard';
import Encoder from './components/Encoder';
import SEO from './components/SEO';
import Footer from './components/Footer';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import CookiePolicy from './components/CookiePolicy';
import FileComparison from './pages/FileComparison/FileComparison';
import AboutUs from './components/AboutUs';
import { Link } from 'react-router-dom';
import { FileCode2, Menu, X } from 'lucide-react';
import { ThemeToggle } from './components/ThemeToggle';

const AppRoutes: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 transition-colors duration-300">
      <SEO />
      {/* Header with navigation */}
      <header className="flex-none h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50 transition-colors duration-300">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
            <FileCode2 className="text-white w-5 h-5" />
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">My Day Tools</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Dashboard</Link>
          <Link to="/json-master" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">JSON Master</Link>
          <Link to="/text-compare" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Text Compare</Link>
          <Link to="/file-comparison" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">File Compare</Link>
          <Link to="/encode-decode" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Encode Decode</Link>
          <Link to="/blog" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Blogs</Link>
          <div className="pl-2 border-l border-slate-200 dark:border-slate-800">
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile Menu Toggle & Theme */}
        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <button
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white dark:bg-slate-950 pt-20 px-6 transition-colors duration-300">
          <nav className="flex flex-col gap-6 text-center pt-10">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Tools</Link>
            <Link to="/json-master" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">JSON Master</Link>
            <Link to="/text-compare" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Text Compare</Link>
            <Link to="/file-comparison" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">File Compare</Link>
            <Link to="/encode-decode" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Encode Decode</Link>
            <Link to="/blog" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Blog</Link>
          </nav>
        </div>
      )}

      {/* Main routing area */}
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/json-master" element={<Home />} />
          <Route path="/text-compare" element={<TextCompareHome />} />
          <Route path="/file-comparison" element={<FileComparison />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/encode-decode" element={<Encoder />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/about" element={<AboutUs />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default AppRoutes;
