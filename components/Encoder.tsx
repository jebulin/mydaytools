import React from 'react';
import Converter from './Converter';
import SEO from './SEO';

const Encoder: React.FC = () => {
  return (
    <>
      <SEO
        title="Encode & Decode - Base64, URL, HTML Entities"
        description="Powerful online encoder and decoder. Support for Base64, URL encoding, HTML entities, and more. Fast, secure, and privacy-focused."
        canonical="/encode-decode"
      />
      <div className="min-h-screen bg-slate-950 text-slate-200 overflow-y-auto">
        <header className="sr-only">
          <h1>Encode Decode: Free Online Data Transformation Tool</h1>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12 text-center md:text-left">
            <h2 className="text-3xl font-bold text-white mb-2">Encode & Decode</h2>
            <p className="text-slate-400">Transform your data between various formats instantly.</p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-sm shadow-2xl">
            <Converter />
          </div>

          <section className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl">
              <h3 className="text-xl font-bold text-blue-400 mb-4">Base64 Encoding</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format.
                It is commonly used to embed image data within HTML or CSS files, or to transmit data over media
                that are designed to handle textual information.
              </p>
            </div>
            <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl">
              <h3 className="text-xl font-bold text-emerald-400 mb-4">URL Encoding</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                URL encoding (Percent-encoding) is a mechanism for encoding information in a Uniform Resource Identifier (URI).
                Characters not allowed in a URI are replaced with a '%' followed by two hexadecimal digits.
                This ensures that your URLs are correctly interpreted by all web browsers and servers.
              </p>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Encoder;
