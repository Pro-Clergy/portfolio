'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md"
      >
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">⚠️</span>
        </div>
        <h1 className="font-display font-bold text-2xl text-text-primary mb-3">
          Something went wrong
        </h1>
        <p className="text-text-muted text-lg leading-relaxed mb-8">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="group inline-flex items-center gap-2 px-7 py-3.5 bg-accent text-bg-primary font-body font-semibold rounded-xl hover:brightness-110 transition-all duration-300"
        >
          <RefreshCw
            size={18}
            className="transition-transform duration-300 group-hover:rotate-180"
          />
          Try Again
        </button>
      </motion.div>
    </div>
  );
}
