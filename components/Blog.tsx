import React, { useEffect } from 'react';
import Card from './ui/card';
import blogs from '../blogData.json';
import { Link } from 'react-router-dom';

const Blog: React.FC = () => {
  // SEO for the list page
  useEffect(() => {
    document.title = 'JSON Master – Blog';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', 'Insights and best practices about JSON usage, formatting, and tooling.');
    } else {
      const metaTag = document.createElement('meta');
      metaTag.name = 'description';
      metaTag.content = 'Insights and best practices about JSON usage, formatting, and tooling.';
      document.head.appendChild(metaTag);
    }
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 h-screen">
      <h1 className="text-3xl font-bold text-white mb-4">JSON Insights Blog</h1>
      {/* Scrollable list of blog cards */}
      <div className="flex flex-col gap-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        {blogs.map((post: any) => (
          <Link key={post.id} to={`/blog/${post.slug}`} className="block transition-transform hover:scale-[1.01] active:scale-[0.99]">
            <Card title={post.title} image={post.image} className="cursor-pointer">
              {post.excerpt}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Blog;
