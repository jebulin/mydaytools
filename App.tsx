import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { FileCode2, Menu, X } from 'lucide-react';
import Home from './components/Home'; // Json Master tool
import Blog from './components/Blog';
import BlogDetail from './components/BlogDetail';
import TextCompareHome from './components/TextCompareHome';
import Dashboard from './components/Dashboard'; // New tools dashboard
import Footer from './components/Footer';
import Encoder from './components/Encoder';
import SEO from './components/SEO';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <BrowserRouter>
      <SEO /> {/* Default SEO settings */}
      <div className="flex flex-col min-h-screen bg-slate-950 text-slate-200">
        {/* Header with navigation */}
        <header className="flex-none h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
              <FileCode2 className="text-white w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-lg tracking-tight text-white">My Day Tools</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-semibold text-slate-400 hover:text-blue-400 transition-colors">Dashboard</Link>
            <Link to="/json-master" className="text-sm font-semibold text-slate-400 hover:text-blue-400 transition-colors">JSON Master</Link>
            <Link to="/text-compare" className="text-sm font-semibold text-slate-400 hover:text-blue-400 transition-colors">Text Compare</Link>
            <Link to="/encode-decode" className="text-sm font-semibold text-slate-400 hover:text-blue-400 transition-colors">Encode Decode</Link>
            <Link to="/blog" className="text-sm font-semibold text-slate-400 hover:text-blue-400 transition-colors">Blogs</Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-slate-400 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-slate-950 pt-20 px-6">
            <nav className="flex flex-col gap-6 text-center pt-10">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">Tools</Link>
              <Link to="/json-master" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">JSON Master</Link>
              <Link to="/text-compare" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">Text Compare</Link>
              <Link to="/encode-decode" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">Encode Decode</Link>
              <Link to="/blog" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">Blog</Link>
            </nav>
          </div>
        )}

        {/* Main routing area */}
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/json-master" element={<Home />} />
            <Route path="/text-compare" element={<TextCompareHome />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/encode-decode" element={<Encoder />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
