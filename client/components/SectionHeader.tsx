'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface SectionHeaderProps {
  label: string;
  title: string;
  description?: string;
}

export default function SectionHeader({ label, title, description }: SectionHeaderProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <div ref={ref} className="mb-16 max-w-2xl">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="font-mono text-sm tracking-[0.2em] uppercase text-accent mb-4"
      >
        {label}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-text-primary leading-tight"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 text-text-muted text-lg leading-relaxed"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
