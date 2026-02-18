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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 overflow-y-auto transition-colors duration-300">
        <header className="sr-only">
          <h1>Encode Decode: Free Online Data Transformation Tool</h1>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12 text-center md:text-left">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Encode & Decode</h2>
            <p className="text-slate-600 dark:text-slate-400">Transform your data between various formats instantly.</p>
          </div>

          <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden backdrop-blur-sm shadow-2xl transition-colors">
            <Converter />
          </div>

          <section className="mt-16 space-y-12 max-w-5xl mx-auto">

            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl transition-colors">
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">Base64 Encoding</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format.
                  It is commonly used to embed image data within HTML or CSS files, or to transmit data over media
                  that are designed to handle textual information.
                </p>
              </div>
              <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl transition-colors">
                <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-4">URL Encoding</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  URL encoding (Percent-encoding) converts characters into a format that can be transmitted over the Internet.
                  Characters not allowed in a URI (like spaces) are replaced with a '%' followed by two hexadecimal digits.
                </p>
              </div>
              <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl transition-colors">
                <h3 className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-4">HTML Entities</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  HTML entities are used to display reserved characters (like &lt;, &gt;, &amp;) in HTML.
                  For example, to display a less than sign (&lt;) we must write: <code>&amp;lt;</code> or <code>&amp;#60;</code>
                </p>
              </div>
            </div>

            <div className="space-y-6 pt-12 border-t border-slate-200 dark:border-slate-800">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-slate-900 dark:text-white font-semibold mb-2">When should I use Base64?</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    Use Base64 when you need to store complex data (like images or encrypted keys) in a text-only format like JSON or XML. It increases the data size by about 33%, so it's best for smaller files.
                  </p>
                </div>
                <div>
                  <h4 className="text-slate-900 dark:text-white font-semibold mb-2">Why do URLs need encoding?</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    URLs can only contain a limited set of characters (ASCII). Any special characters (like emojis, spaces, or foreign letters) must be encoded to ensure the URL is valid and universally understood by browsers.
                  </p>
                </div>
                <div>
                  <h4 className="text-slate-900 dark:text-white font-semibold mb-2">Is encoding the same as encryption?</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    No! Encoding formats data for transmission, but it provides <strong>no security</strong>. Encoded data can be easily decoded by anyone. Encryption transforms data so that only authorized parties can read it.
                  </p>
                </div>
                <div>
                  <h4 className="text-slate-900 dark:text-white font-semibold mb-2">Can I decode partially corrupted strings?</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    Generally, no. Encoding schemes like Base64 are sensitive; if even one character is wrong or missing, the decoding process will likely fail or produce garbage output.
                  </p>
                </div>
              </div>
            </div>

          </section>
        </main>
      </div>
    </>
  );
};

export default Encoder;
