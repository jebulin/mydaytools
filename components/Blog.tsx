import React from 'react';
import blogs from '../blogData.json';
import { Link } from 'react-router-dom';
import SEO from './SEO';

const Blog: React.FC = () => {
  return (
    <>
      <SEO
        title="Developer Blog - JSON Tips & Text Utilities"
        description="Read the latest insights, tutorials, and best practices about JSON formatting, text comparison, and developer productivity tools."
        canonical="/blog"
      />
      <div className="min-h-screen bg-slate-950 text-slate-200 py-12 px-4 sm:px-6 lg:px-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <header className="mb-16 text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
              Engineering Insights
            </h1>
            <p className="text-slate-400 text-lg sm:text-xl">
              Deep dives into data structures, web protocols, and developer workflows.
            </p>
          </header>

          <div className="grid gap-12">
            {blogs.map((post: any) => (
              <article key={post.id} className="group relative flex flex-col items-start">
                <div className="relative w-full aspect-[16/9] mb-6 overflow-hidden rounded-2xl bg-slate-900 border border-white/5">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                </div>

                <div className="flex flex-col flex-1">
                  <div className="flex items-center gap-x-4 text-xs mb-4">
                    <time dateTime={post.date} className="text-slate-500">
                      {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </time>
                    <span className="relative z-10 rounded-full bg-blue-500/10 px-3 py-1.5 font-medium text-blue-400">
                      {post.category || 'Engineering'}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors mb-4">
                    <Link to={`/blog/${post.slug}`}>
                      <span className="absolute inset-0" />
                      {post.title}
                    </Link>
                  </h2>

                  <p className="text-slate-400 leading-relaxed text-base mb-6">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-2 text-blue-400 font-semibold group-hover:text-blue-300 transition-colors">
                    Read article
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;
