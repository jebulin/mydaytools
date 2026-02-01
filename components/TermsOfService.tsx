import React from 'react';
import SEO from './SEO';

const TermsOfService: React.FC = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-20 px-6 transition-colors duration-300">
      <SEO
        title="Terms of Service - My Day Tools"
        description="Terms of Service for My Day Tools. Please read our terms carefully before using our tools."
        canonical="/terms-of-service"
      />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">Terms of Service</h1>

        <div className="space-y-8 text-slate-600 dark:text-slate-300 leading-relaxed">
          <section>
            <p className="text-sm text-slate-500 mb-4">Last Updated: February 1, 2026</p>
            <p>
              By accessing and using <strong>My Day Tools</strong> (mydaytools.com), you agree to be bound by these Terms of Service.
              If you do not agree with any part of these terms, you must not use our website or services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">1. Use of Services</h2>
            <p>
              My Day Tools provides a suite of developer utilities for personal and professional use.
              You agree to use these tools only for lawful purposes and in a way that does not infringe the rights of others or restrict their use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">2. Intellectual Property</h2>
            <p>
              The website and its original content, features, and functionality are owned by <strong>Jebulin</strong> and are protected by international copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">3. Disclaimer of Warranties</h2>
            <p>
              The tools on this website are provided "as is" and "as available" without any warranties of any kind, either express or implied.
              <strong>Jebulin</strong> does not warrant that the tools will be error-free or that any defects will be corrected.
              You use these tools at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">4. Limitation of Liability</h2>
            <p>
              In no event shall <strong>Jebulin</strong> be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the tools.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">5. Modifications to Terms</h2>
            <p>
              We reserve the right to modify or replace these terms at any time. We will indicate at the top of the terms the date they were last updated.
              Continued use of the website after any such changes shall constitute your consent to such changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">6. Governing Law</h2>
            <p>
              These terms shall be governed and construed in accordance with the laws of the jurisdiction in which the owner, <strong>Jebulin</strong>, resides, without regard to its conflict of law provisions.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
