import React from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  twitterHandle?: string;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonical,
  ogType = 'website',
  ogImage = 'https://www.mydaytools.com/og-image.png', // Default OG image
  twitterHandle = '@mydaytools',
}) => {
  const fullTitle = title ? `${title} | My Day Tools` : 'My Day Tools - Essential Online Utilities';
  const fullDescription = description || 'Fast, free, and secure online tools for developers. JSON Formatter, Text Compare, Base64 Encoder, and more.';
  const siteUrl = 'https://www.mydaytools.com';
  const url = canonical ? `${siteUrl}${canonical}` : siteUrl;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content={twitterHandle} />
    </>
  );
};

export default SEO;
