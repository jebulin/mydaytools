import React from 'react';
import { Mail, Linkedin, Instagram, Code2, Database, Globe, Server } from 'lucide-react';
import SEO from './SEO';

const AboutUs: React.FC = () => {
  return (
    <>
      <SEO
        title="About Us - Meet the Developer"
        description="Learn about Jebulin A, the full stack developer behind My Day Tools. Specializing in backend systems, data scraping, and scalable web applications."
        canonical="/about"
      />
      <div className="flex-1 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        {/* Hero Section */}
        <div className="relative py-20 px-6 lg:px-8 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
              About <span className="text-blue-600 dark:text-blue-400">Us</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Building premium, privacy-focused tools for developers and creators.
              Driven by passion for code and a commitment to excellence.
            </p>
          </div>
        </div>

        {/* Profile Section */}
        <div className="py-16 px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col md:flex-row transition-colors duration-300">

              {/* Left Column: Image/Gradient & Socials */}
              <div className="md:w-1/3 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 flex flex-col items-center justify-center text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2070&auto=format&fit=crop')] opacity-10 bg-cover bg-center" />

                <div className="relative z-10 w-32 h-32 md:w-40 md:h-40 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 shadow-2xl border-4 border-white/30">
                  <span className="text-5xl font-bold">J</span>
                </div>

                <h2 className="relative z-10 text-2xl font-bold mb-2">Jebulin A</h2>
                <p className="relative z-10 text-blue-100 font-medium mb-8">Full Stack Developer</p>

                <div className="relative z-10 flex gap-4">
                  <a
                    href="https://in.linkedin.com/in/jebulin3"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-all transform hover:scale-110"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={20} />
                  </a>
                  <a
                    href="https://instagram.com/jebulin_dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-all transform hover:scale-110"
                    aria-label="Instagram"
                  >
                    <Instagram size={20} />
                  </a>
                  <a
                    href="mailto:jebulin3@gmail.com"
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-all transform hover:scale-110"
                    aria-label="Email"
                  >
                    <Mail size={20} />
                  </a>
                </div>
              </div>

              {/* Right Column: Bio & Skills */}
              <div className="md:w-2/3 p-8 md:p-12">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Code2 className="text-blue-600 dark:text-blue-400" size={24} />
                  The Developer
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                  Hello! I'm Jebulin A, the owner and lead developer of My Day Tools.
                  I am a passionate Full Stack Developer with a knack for building robust
                  backend systems and scalable web applications.
                </p>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <Database className="text-blue-600 dark:text-blue-400" size={24} />
                  Core Expertise
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900/50 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <Server className="text-blue-600 dark:text-blue-400" size={20} />
                      <span className="font-semibold text-slate-900 dark:text-white">Backend Specialist</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Architecting secure and efficient server-side logic and APIs.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900/50 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <Globe className="text-blue-600 dark:text-blue-400" size={20} />
                      <span className="font-semibold text-slate-900 dark:text-white">Data Scraping</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Mastery in extracting insights and data from complex web sources.
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-900/30">
                  <h4 className="text-blue-900 dark:text-blue-100 font-bold mb-2">Open for Projects</h4>
                  <p className="text-blue-800 dark:text-blue-200 text-sm mb-4">
                    I'm currently accepting new projects. Whether you need a complex data scraping solution,
                    a full-stack web application, or backend optimization, let's build something great together.
                  </p>
                  <a
                    href="mailto:jebulin3@gmail.com"
                    className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                  >
                    Get in touch <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
