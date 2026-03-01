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
  'Flutter',
  'Dart',
  'React Native',
  'HTML/CSS',
  'SQL',
  'Tailwind CSS',
  'Figma',
  'MongoDB',
  'PostgreSQL',
  'Git',
  'Docker',
  'Linux',
  'Wireshark',
  'Pandas',
  'Scikit-learn',
];

const stats = [
  { value: '10+', label: 'Projects Built' },
  { value: '8+', label: 'Technologies' },
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
              Hey, I&apos;m Mathias Aidoo — a Computer Science student at Kumasi Technical
              University who fell in love with building things through code. What started as
              tinkering with HTML pages in a campus lab has grown into a full-blown obsession
              with crafting software that actually solves problems people care about.
            </motion.p>
            <motion.p variants={fadeUp} className="text-text-muted text-lg leading-relaxed mb-5">
              I don&apos;t believe in staying in one lane. I design interfaces in Figma,
              build full-stack web apps with React and Node.js, ship cross-platform mobile
              apps with Flutter, and think deeply about cybersecurity — because what&apos;s the
              point of building something great if it isn&apos;t secure? I also enjoy the
              system analyst side of things: sitting with a messy business problem and
              turning it into a clean, scalable architecture.
            </motion.p>
            <motion.p variants={fadeUp} className="text-text-muted text-lg leading-relaxed mb-5">
              One of my proudest moments was leading a research team that analyzed over
              5,000 retail transactions across 8 Ghanaian cities — using K-Means clustering,
              association rules, and predictive modeling to uncover real patterns in how
              people shop. That project taught me that data tells stories if you know how
              to listen.
            </motion.p>
            <motion.p variants={fadeUp} className="text-text-muted text-lg leading-relaxed mb-8">
              Outside of work, you&apos;ll find me exploring whatever new technology just
              dropped, contributing to open-source projects, or sketching out my next SaaS
              idea on a whiteboard. I believe the best software is functional, beautiful,
              secure, and built with empathy for the people who use it.
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
