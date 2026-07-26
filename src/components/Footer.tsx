import React from 'react';
import { ExternalLink, ShieldCheck, Heart, Github, Instagram } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full max-w-5xl mx-auto mt-8 mb-6 px-4 text-center text-xs text-neutral-500">
      <div className="flat-card p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        {/* Left: Security badge & author credit */}
        <div className="flex items-center gap-2 text-neutral-400">
          <ShieldCheck className="w-4 h-4 text-red-500 shrink-0" />
          <span>India Post Tracker by</span>
          <a
            href="https://github.com/5araang"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white font-bold hover:text-red-500 transition-colors flex items-center gap-1"
          >
            Sarang (<span className="text-red-500">5araang</span>)
          </a>
        </div>

        {/* Center/Right: Social & Support Links */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/5araang"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <Github className="w-3.5 h-3.5 text-neutral-400" />
            <span>GitHub</span>
          </a>

          <a
            href="https://instagram.com/5araang"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-pink-500 flex items-center gap-1 transition-colors"
          >
            <Instagram className="w-3.5 h-3.5 text-pink-500" />
            <span>Support @5araang</span>
          </a>

          <a
            href="https://www.indiapost.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>Official Site</span>
            <ExternalLink className="w-3 h-3 text-red-500" />
          </a>
        </div>
      </div>
    </footer>
  );
};
