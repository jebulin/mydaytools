import React from 'react';
import { Link } from 'react-router-dom';
import Card from './ui/card';

// Dashboard component that showcases available tools in stylish cards.
// Future tools can be added by simply adding more Card entries.
const Dashboard: React.FC = () => {
  const tools = [
    {
      title: 'JSON Master',
      path: '/json-master',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=60', // placeholder image
    },
    {
      title: 'Text Compare',
      path: '/text-compare',
      image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=60',
    },
    {
      title: 'Encode Decode',
      path: '/encode-decode',
      image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=60',
    },
    // Add future tools here
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 p-6">
      <h1 className="text-4xl font-bold text-slate-100 mb-8">Tools Dashboard</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-5xl">
        {tools.map((tool) => (
          <Link key={tool.title} to={tool.path} className="focus:outline-none">
            <Card title={tool.title} image={tool.image} className="h-full hover:scale-105 transform transition" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
