import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { FileCode2 } from 'lucide-react';
import Home from './components/Home'; // Json Master tool
import Blog from './components/Blog';
import BlogDetail from './components/BlogDetail';
import TextCompareHome from './components/TextCompareHome';
import Dashboard from './components/Dashboard'; // New tools dashboard
import Footer from './components/Footer';
import UrlParser from './components/UrlParser';
import Encoder from './components/Encoder';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen bg-slate-950 text-slate-200">
        {/* Header with navigation */}
        <header className="flex-none h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur px-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <FileCode2 className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight text-white">My Day Tools</h1>
              <p className="text-xs text-slate-500 font-medium">JSON Master • Text Compare • Encode Decode</p>
            </div>
          </div>
          <nav className="flex items-center gap-4">
            <Link to="/" className="text-sm font-medium text-slate-200 hover:text-blue-400 transition-colors">Tools</Link>
            <Link to="/json-master" className="text-sm font-medium text-slate-200 hover:text-blue-400 transition-colors">JSON Master</Link>
            <Link to="/text-compare" className="text-sm font-medium text-slate-200 hover:text-blue-400 transition-colors">Text Compare</Link>
            <Link to="/encode-decode" className="text-sm font-medium text-slate-200 hover:text-blue-400 transition-colors">Encode Decode</Link>
            <Link to="/blog" className="text-sm font-medium text-slate-200 hover:text-blue-400 transition-colors">Blog</Link>


          </nav>
        </header>
        {/* Main routing area */}
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/json-master" element={<Home />} />
            <Route path="/text-compare" element={<TextCompareHome />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/encode-decode" element={<Encoder />} />

          </Routes>
        </main>
        {/* <Footer /> */}
      </div>
    </BrowserRouter>
  );
};

export default App;
