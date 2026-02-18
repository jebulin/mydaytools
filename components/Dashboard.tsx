import React from 'react';
import { Link } from 'react-router-dom';
import Card from './ui/card';
import SEO from './SEO';

// Dashboard component that showcases available tools in stylish cards.
const Dashboard: React.FC = () => {
  const tools = [
    {
      title: 'JSON Master',
      description: 'Format, validate, and beautify your JSON data with ease.',
      path: '/json-master',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=60',
    },
    {
      title: 'Text Compare',
      description: 'Compare two text snippets and highlight the differences.',
      path: '/text-compare',
      image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=60',
    },
    {
      title: 'Encode Decode',
      description: 'Encode and decode Base64, URL, and other data formats.',
      path: '/encode-decode',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=60',
    },
    {
      title: 'File Comparison',
      description: 'Compare two excel files and highlight the differences.',
      path: '/file-comparison',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=60',
    },
    {
      title: 'Split Bill',
      description: 'Upload receipts and easily split bills among friends with AI assistance.',
      path: '/split-bill',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=60',
    },
  ];

  return (
    <>
      <SEO
        title="Developer Tools Dashboard"
        description="Explore a collection of essential online tools for developers including JSON Formatter, Text Compare, and Encoder/Decoder."
        canonical="/"
      />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-950 p-6 transition-colors duration-300">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-400 dark:to-emerald-400 mb-4">
            Developer Tools Suite
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            A comprehensive collection of free, fast, and secure online utilities designed to streamline your development workflow.
          </p>
        </header>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl">
          {tools.map((tool) => (
            <Link key={tool.title} to={tool.path} className="group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl transition-all duration-300">
              <article className="h-full bg-white/80 dark:bg-slate-900/50 backdrop-blur border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 active:scale-[0.98] transition-all">
                <Card title={tool.title} image={tool.image} className="transition-transform duration-500 group-hover:scale-105" />
                <div className="p-5">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-wider">{tool.title}</h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{tool.description}</p>
                </div>
              </article>
            </Link>
          ))}
        </div>

        <section className="mt-20 max-w-5xl w-full grid md:grid-cols-2 gap-12 text-left">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Why use My Day Tools?</h2>
            <div className="space-y-4">
              <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-blue-600 dark:text-blue-400 font-semibold mb-1 flex items-center gap-2">
                  <span className="text-xl">🔒</span> Privacy First
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  We believe your data belongs to you. All our tools (JSON validation, text comparison, bill splitting) run entirely in your browser. Your sensitive files and text never leave your device.
                </p>
              </div>
              <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-emerald-600 dark:text-emerald-400 font-semibold mb-1 flex items-center gap-2">
                  <span className="text-xl">⚡</span> Blazing Fast
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  No server round-trips means instant results. Whether you're pasting 10,000 lines of JSON or a large Excel file, our optimized local algorithms handle it in milliseconds.
                </p>
              </div>
              <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-purple-600 dark:text-purple-400 font-semibold mb-1 flex items-center gap-2">
                  <span className="text-xl">💎</span> 100% Free
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  No subscriptions, no hidden fees, and no "pro" plans. Every feature, including AI repair and file comparison, is completely free to use.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">About the Suite</h2>
            <div className="prose dark:prose-invert text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              <p>
                <strong>My Day Tools</strong> was built to solve the frustration of finding simple, reliable developer utilities that don't steal your data or bombard you with ads.
              </p>
              <p>
                Our mission is to provide a clean, modern, and privacy-focused alternative to the cluttered tool sites of the past. Whether you are a full-stack developer debugging an API response, a student learning to code, or a writer checking a draft, we have a tool for you.
              </p>
              <p className="border-t border-slate-200 dark:border-slate-800 pt-4 mt-4">
                <em>Continuously updated with new features and improvements based on user feedback.</em>
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Dashboard;
