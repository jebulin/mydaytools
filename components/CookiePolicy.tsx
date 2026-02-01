import React from 'react';
import SEO from './SEO';

const CookiePolicy: React.FC = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-20 px-6 transition-colors duration-300">
      <SEO
        title="Cookie Policy - My Day Tools"
        description="Cookie Policy for My Day Tools. Learn about how we use cookies to improve your experience."
        canonical="/cookie-policy"
      />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">Cookie Policy</h1>

        <div className="space-y-8 text-slate-600 dark:text-slate-300 leading-relaxed">
          <section>
            <p className="text-sm text-slate-500 mb-4">Last Updated: February 1, 2026</p>
            <p>
              This Cookie Policy explains how <strong>My Day Tools</strong> (mydaytools.com) uses cookies and similar technologies.
              By using our website, you consent to the use of cookies as described in this policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">1. What are Cookies?</h2>
            <p>
              Cookies are small text files that are stored on your device (computer or mobile device) when you visit a website.
              They are widely used to make websites work or work more efficiently, as well as to provide information to the owners of the site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">2. How We Use Cookies</h2>
            <p>
              My Day Tools uses cookies for the following purposes:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li><strong>Essential Cookies:</strong> These are cookies that are required for the operation of our website. They include, for example, cookies that enable you to use our editor features.</li>
              <li><strong>Preferences:</strong> We use cookies to remember your settings and preferences (such as your theme choice or editor configuration) to enhance your user experience.</li>
              <li><strong>Analytics:</strong> We may use analytical/performance cookies to help us understand how visitors interact with our website, helping us to improve the site's structure and content.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">3. Local Storage</h2>
            <p>
              In addition to cookies, we use <strong>Browser Local Storage</strong> to save your current work or configuration in our tools.
              This data stays on your device and is not sent to our servers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">4. Managing Cookies</h2>
            <p>
              Most web browsers allow you to control cookies through their settings. You can set your browser to block cookies or delete them.
              Please note that if you choose to block cookies, some parts of our website may not function properly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">5. Contact Information</h2>
            <p>
              If you have any questions about our use of cookies, please contact <strong>Jebulin</strong> through the contact information provided on the website.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
