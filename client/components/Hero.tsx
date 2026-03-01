'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';

const codeLines = [
  { type: 'comment', text: '// engineer.ts' },
  { type: 'keyword', text: 'const ' },
  { type: 'function', text: 'engineer' },
  { type: 'brace', text: ' = {' },
  { type: 'property', text: '  name: ' },
  { type: 'string', text: '"Mathias Aidoo"' },
  { type: 'brace', text: ',' },
  { type: 'property', text: '  location: ' },
  { type: 'string', text: '"Kumasi, Ghana 🇬🇭"' },
  { type: 'brace', text: ',' },
  { type: 'property', text: '  roles: ' },
  { type: 'brace', text: '[' },
  { type: 'string', text: '"Software Engineer"' },
  { type: 'brace', text: ',' },
  { type: 'property', text: '         ' },
  { type: 'string', text: '"Full-Stack Dev"' },
  { type: 'brace', text: ',' },
  { type: 'property', text: '         ' },
  { type: 'string', text: '"UI/UX Designer"' },
  { type: 'brace', text: '],' },
  { type: 'property', text: '  university: ' },
  { type: 'string', text: '"Kumasi Technical University"' },
  { type: 'brace', text: ',' },
  { type: 'property', text: '  skills: ' },
  { type: 'brace', text: '[' },
  { type: 'string', text: '"React"' },
  { type: 'brace', text: ', ' },
  { type: 'string', text: '"Next.js"' },
  { type: 'brace', text: ', ' },
  { type: 'string', text: '"Python"' },
  { type: 'brace', text: ', ' },
  { type: 'string', text: '"Flutter"' },
  { type: 'brace', text: '],' },
  { type: 'property', text: '  available: ' },
  { type: 'keyword', text: 'true' },
  { type: 'brace', text: ',' },
  { type: 'brace', text: '};' },
];

function CodeWindow() {
  /* Build rendered lines from the token array */
  const rendered: React.ReactNode[][] = [];
  let current: React.ReactNode[] = [];

  codeLines.forEach((token, i) => {
    const className = `code-${token.type}`;

    if (token.text.startsWith('//')) {
      /* comment takes a full line */
      if (current.length) { rendered.push(current); current = []; }
      current.push(<span key={i} className={className}>{token.text}</span>);
      rendered.push(current);
      current = [];
    } else if (
      token.text.startsWith('  ') &&
      token.type === 'property'
    ) {
      /* new property line */
      if (current.length) { rendered.push(current); current = []; }
      current.push(<span key={i} className={className}>{token.text}</span>);
    } else if (token.text === '};') {
      if (current.length) { rendered.push(current); current = []; }
      current.push(<span key={i} className={className}>{token.text}</span>);
      rendered.push(current);
      current = [];
    } else {
      current.push(<span key={i} className={className}>{token.text}</span>);
    }
  });
  if (current.length) rendered.push(current);

  return (
    <div className="relative w-full max-w-md mx-auto lg:mx-0">
      {/* Glow blob */}
      <div className="absolute -inset-12 bg-accent/20 rounded-full blur-3xl glow-blob pointer-events-none" />

      <div className="relative bg-bg-card border border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 text-xs text-text-muted font-mono">engineer.ts</span>
        </div>

        {/* Code body */}
        <div className="p-5 font-mono text-[13px] leading-6 overflow-x-auto">
          {rendered.map((line, idx) => (
            <div key={idx}>{line}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden">
      <div className="max-w-container mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Code window — appears first on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="order-first lg:order-last"
          >
            <CodeWindow />
          </motion.div>

          {/* Content */}
          <div className="order-last lg:order-first">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-dim border border-accent/20 mb-8"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
              </span>
              <span className="text-sm font-body text-accent font-medium">
                Open to opportunities
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display font-extrabold leading-[1.1] mb-6"
              style={{ fontSize: 'clamp(2.8rem, 5.5vw, 4.5rem)' }}
            >
              I build
              <br />
              <span className="gradient-text">digital experiences</span>
              <br />
              that matter.
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-text-muted text-lg leading-relaxed max-w-xl mb-10"
            >
              Software Engineer, Full-Stack Developer &amp; UI/UX Designer based in
              Kumasi, Ghana. I build secure, scalable applications — from mobile apps
              and web platforms to intelligent data solutions and elegant interfaces.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={() => scrollTo('#projects')}
                className="group inline-flex items-center gap-2 px-7 py-3.5 bg-accent text-bg-primary font-body font-semibold rounded-xl hover:brightness-110 transition-all duration-300"
              >
                View My Work
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
              <button
                onClick={() => scrollTo('#contact')}
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-text-primary/20 text-text-primary font-body font-semibold rounded-xl hover:border-accent hover:text-accent transition-all duration-300"
              >
                Get In Touch
              </button>
              <a
                href="/resume.pdf"
                download
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-text-primary/20 text-text-primary font-body font-semibold rounded-xl hover:border-secondary hover:text-secondary transition-all duration-300"
              >
                <Download size={18} />
                Resume
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
