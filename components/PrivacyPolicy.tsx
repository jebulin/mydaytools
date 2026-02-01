import React from 'react';
import SEO from './SEO';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-20 px-6 transition-colors duration-300">
      <SEO
        title="Privacy Policy - My Day Tools"
        description="Privacy Policy for My Day Tools. We value your privacy and process data locally in your browser."
        canonical="/privacy-policy"
      />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">Privacy Policy</h1>

        <div className="space-y-8 text-slate-600 dark:text-slate-300 leading-relaxed">
          <section>
            <p className="text-sm text-slate-500 mb-4">Last Updated: February 1, 2026</p>
            <p>
              Welcome to <strong>My Day Tools</strong> (mydaytools.com). Your privacy is of paramount importance to us.
              This Privacy Policy explains how we handle your information when you use our website and tools.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">1. Local Data Processing</h2>
            <p>
              The core philosophy of My Day Tools is privacy-first. Most of our tools (JSON Master, Text Compare, Encode/Decode) process your data <strong>locally in your browser</strong>.
              This means your input data never leaves your computer and is not sent to our servers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">2. AI-Powered Features</h2>
            <p>
              When you explicitly use our AI-powered features (such as "AI Fix" or "Generate Sample JSON"), the specific snippet of data you provide is sent to <strong>Google's Gemini API</strong> for processing.
              By using these features, you agree to Google's privacy terms. We do not store these snippets on our own servers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">3. Data Collection</h2>
            <p>
              We do not require user registration or accounts. We do not collect personal identification information such as your name, email address, or phone number.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">4. Log Data</h2>
            <p>
              Like most websites, we may collect information that your browser sends whenever you visit our Service ("Log Data").
              This may include information such as your computer's Internet Protocol ("IP") address, browser type, browser version, the pages of our Service that you visit, the time and date of your visit, and other statistics.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">5. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact the owner, <strong>Jebulin</strong>, via the contact links in the footer of our website.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
