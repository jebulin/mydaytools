import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import blogs from '../blogData.json';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import SEO from './SEO';

const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center transition-colors">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Post Not Found</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">The blog post you're looking for doesn't exist or has been moved.</p>
        <Link
          to="/blog"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20"
        >
          Return to Blog
        </Link>
      </div>
    );
  }

  // Structured Data (JSON-LD) for the blog post
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.excerpt,
    "image": blog.image,
    "author": {
      "@type": "Organization",
      "name": "My Day Tools"
    },
    "publisher": {
      "@type": "Organization",
      "name": "My Day Tools",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.mydaytools.com/logo.png"
      }
    },
    "datePublished": blog.date || "2026-01-30",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.mydaytools.com/blog/${blog.slug}`
    }
  };

  return (
    <>
      <SEO
        title={blog.title}
        description={blog.excerpt}
        ogType="article"
        ogImage={blog.image}
        canonical={`/blog/${blog.slug}`}
      />
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 overflow-y-auto pb-20 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <nav className="mb-10">
            <button
              onClick={() => navigate('/blog')}
              className="group flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
              <span className="text-sm font-medium">Back to Articles</span>
            </button>
          </nav>

          <article>
            <header className="mb-10 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mb-6 text-slate-500 text-sm">
                <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 transition-colors">
                  <Calendar size={14} className="text-blue-600 dark:text-blue-400" />
                  {new Date(blog.date || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 transition-colors">
                  <Tag size={14} className="text-emerald-600 dark:text-emerald-400" />
                  {blog.category || 'Engineering'}
                </span>
                <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 transition-colors">
                  <User size={14} className="text-purple-600 dark:text-purple-400" />
                  By My Day Tools Team
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight mb-8">
                {blog.title}
              </h1>

              <div className="relative aspect-[21/9] w-full mb-12 overflow-hidden rounded-3xl border border-slate-200 dark:border-white/5 shadow-2xl">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-50/40 via-transparent to-transparent dark:from-slate-950/40" />
              </div>
            </header>

            <div className="prose prose-slate dark:prose-invert prose-lg max-w-none">
              <div className="text-slate-700 dark:text-slate-300 text-lg sm:text-xl leading-relaxed whitespace-pre-line space-y-6">
                {blog.content}
              </div>
            </div>

            <footer className="mt-20 pt-10 border-t border-slate-200 dark:border-slate-800 transition-colors">
              <div className="bg-white dark:bg-slate-900/50 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 backdrop-blur-sm shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Helpful Tools</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                  Liked this article? Check out our tools that can help you implement these concepts in your own projects.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/json-master" className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-sm font-semibold rounded-xl border border-slate-300 dark:border-slate-700 transition-all">
                    JSON Master
                  </Link>
                  <Link to="/text-compare" className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-sm font-semibold rounded-xl border border-slate-300 dark:border-slate-700 transition-all">
                    Text Compare
                  </Link>
                </div>
              </div>
            </footer>
          </article>
        </div>
      </div>
    </>
  );
};

export default BlogDetail;
