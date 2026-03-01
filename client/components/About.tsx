'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { GraduationCap } from 'lucide-react';
import SectionHeader from './SectionHeader';

const techStack = [
  'Python',
  'JavaScript',
  'TypeScript',
  'React',
  'Next.js',
  'Node.js',
  'Express',
  'HTML/CSS',
  'SQL',
  'Pandas',
  'Scikit-learn',
  'Git',
  'Tailwind CSS',
  'MongoDB',
  'PostgreSQL',
];

const stats = [
  { value: '10+', label: 'Projects Built' },
  { value: '5+', label: 'Technologies' },
  { value: '3+', label: 'Years Coding' },
];

/* Animation variants — module-level to avoid recreation on every render */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function About() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="about" className="py-20 lg:py-28 px-6">
      <div className="max-w-container mx-auto">
        <SectionHeader
          label="// About Me"
          title="Turning ideas into real-world solutions"
        />

        <div ref={ref} className="grid lg:grid-cols-2 gap-14 lg:gap-20">
          {/* Left — Bio & Tech */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={inView ? 'show' : 'hidden'}
          >
            <motion.p variants={fadeUp} className="text-text-muted text-lg leading-relaxed mb-5">
              I&apos;m Mathias, a Computer Science student at Kumasi Technical University with a
              deep passion for building things that live on the internet. My journey in tech
              started with curiosity and quickly grew into a full-on love for solving problems
              through code.
            </motion.p>
            <motion.p variants={fadeUp} className="text-text-muted text-lg leading-relaxed mb-5">
              I specialize in full-stack web development — building responsive, user-centric
              applications from the database layer to the pixel. I&apos;m equally fascinated
              by data science and machine learning, having led a data mining project that
              analyzed 5,000+ retail transactions across 8 Ghanaian cities using clustering,
              association rules, and predictive modeling.
            </motion.p>
            <motion.p variants={fadeUp} className="text-text-muted text-lg leading-relaxed mb-8">
              When I&apos;m not coding, I&apos;m exploring new technologies, contributing to open-source,
              or brainstorming SaaS ideas. I believe great software should be functional,
              beautiful, and accessible to everyone.
            </motion.p>

            {/* Tech stack pills */}
            <motion.div variants={fadeUp}>
              <p className="font-mono text-sm text-accent tracking-wider uppercase mb-4">
                Tech Stack
              </p>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 bg-bg-card border border-white/[0.06] rounded-lg text-sm font-mono text-text-muted hover:text-accent hover:border-accent/30 transition-colors duration-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right — Stats & Education */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={inView ? 'show' : 'hidden'}
            className="space-y-6"
          >
            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={fadeUp}
                  className="bg-bg-card border border-white/[0.06] rounded-2xl p-5 text-center hover:border-accent/20 transition-colors duration-300"
                >
                  <p className="font-display font-extrabold text-3xl text-accent mb-1">
                    {stat.value}
                  </p>
                  <p className="text-text-muted text-xs font-body">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Education card */}
            <motion.div
              variants={fadeUp}
              className="bg-bg-card border border-white/[0.06] rounded-2xl p-7 hover:border-accent/20 transition-colors duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent-dim flex items-center justify-center">
                  <GraduationCap size={24} className="text-accent" />
                </div>
                <div>
                  <p className="font-display font-bold text-lg text-text-primary mb-1">
                    BSc. Computer Science
                  </p>
                  <p className="text-text-muted text-sm mb-2">
                    Kumasi Technical University
                  </p>
                  <p className="text-text-muted text-sm leading-relaxed">
                    Specialization in Data Warehousing &amp; Data Mining. Led Group One in
                    analyzing customer purchase behavior using K-Means clustering, Apriori
                    algorithm, and predictive modeling techniques on real-world Ghanaian
                    retail datasets.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
