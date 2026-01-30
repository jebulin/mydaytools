import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import blogs from '../blogData.json';
import { ArrowLeft } from 'lucide-react';

const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const blog = blogs.find((b) => b.slug === slug);

  useEffect(() => {
    if (blog) {
      document.title = `${blog.title} | JSON Master Blog`;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) {
        meta.setAttribute('content', blog.excerpt);
      }
    }
  }, [blog]);

  if (!blog) {
    return (
      <div className="p-6 text-center text-white">
        <h1 className="text-2xl font-bold">Blog post not found</h1>
        <Link to="/blog" className="text-blue-400 hover:underline mt-4 inline-block">Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto h-full overflow-y-auto pb-20">
      <button
        onClick={() => navigate('/blog')}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft size={20} />
        <span>Back to Blog</span>
      </button>

      <article className="space-y-6">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-80 object-cover rounded-xl shadow-2xl"
        />

        <h1 className="text-4xl font-extrabold text-white leading-tight">{blog.title}</h1>

        <div className="text-slate-300 text-lg leading-relaxed whitespace-pre-line space-y-4">
          {blog.content}
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;
