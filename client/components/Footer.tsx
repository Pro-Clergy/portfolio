'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter } from 'lucide-react';

const socials = [
  { icon: Github, href: 'https://github.com/Pro-Clergy', label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com/in/mathias-aidoo', label: 'LinkedIn' },
  { icon: Twitter, href: 'https://x.com/ProfessorClergy', label: 'X / Twitter' },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-10 px-6">
      <div className="max-w-container mx-auto flex flex-col items-center gap-6">
        {/* Social icons */}
        <div className="flex items-center gap-4">
          {socials.map((s) => {
            const Icon = s.icon;
            return (
              <motion.a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="me noopener noreferrer"
                aria-label={s.label}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full border border-white/[0.08] flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/30 transition-colors duration-200"
              >
                <Icon size={18} />
              </motion.a>
            );
          })}
        </div>

        {/* Copyright */}
        <p className="text-text-muted text-sm text-center" suppressHydrationWarning>
          &copy; {new Date().getFullYear()} Mathias. Designed &amp; Built with ❤️
        </p>
      </div>
    </footer>
  );
}
