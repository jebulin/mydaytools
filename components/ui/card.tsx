import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  image?: string; // optional image URL for SEO and visual appeal
  rank?: number; // optional rank for ordering
  excerpt?: string; // optional short excerpt preview
}

const Card: React.FC<CardProps> = ({ title, children, className, image, rank, excerpt }) => {
  return (
    <div className={`bg-slate-800 rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow ${className ?? ''}`}>
      {rank && (
        <div className="text-sm font-medium text-yellow-300 mb-2">#{rank}</div>
      )}
      {image && (
        <img src={image} alt={title} className="w-full h-48 object-cover rounded-t-lg mb-4" />
      )}
      <h2 className="text-2xl font-semibold text-slate-100 mb-2">{title}</h2>
      {excerpt && (
        <p className="text-slate-300 mb-3 line-clamp-3">{excerpt}</p>
      )}
      <div className="text-slate-300 whitespace-pre-line leading-relaxed">{children}</div>
    </div>
  );
};

export default Card;
