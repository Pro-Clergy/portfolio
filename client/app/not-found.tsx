'use client';

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md"
      >
        <h1
          className="font-display font-extrabold gradient-text mb-4"
          style={{ fontSize: 'clamp(5rem, 12vw, 10rem)' }}
        >
          404
        </h1>
        <h2 className="font-display font-bold text-2xl text-text-primary mb-3">
          Page not found
        </h2>
        <p className="text-text-muted text-lg leading-relaxed mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="group inline-flex items-center gap-2 px-7 py-3.5 bg-accent text-bg-primary font-body font-semibold rounded-xl hover:brightness-110 transition-all duration-300"
        >
          <ArrowLeft
            size={18}
            className="transition-transform duration-300 group-hover:-translate-x-1"
          />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
