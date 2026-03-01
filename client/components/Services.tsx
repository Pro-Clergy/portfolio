'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Globe,
  BarChart3,
  Palette,
  Zap,
  Database,
  Rocket,
} from 'lucide-react';
import SectionHeader from './SectionHeader';

const services = [
  {
    icon: Globe,
    title: 'Web Development',
    description:
      'Responsive, performant web applications built with modern frameworks. From landing pages to full-stack platforms — optimized for speed and scalability.',
  },
  {
    icon: BarChart3,
    title: 'Data Analysis & ML',
    description:
      'Transform raw data into actionable insights. Customer segmentation, predictive modeling, and visualization dashboards that drive smarter decisions.',
  },
  {
    icon: Palette,
    title: 'UI/UX Design',
    description:
      'Intuitive, accessible interfaces where aesthetics meet usability. Designs that convert visitors into customers and make complex workflows simple.',
  },
  {
    icon: Zap,
    title: 'API Development',
    description:
      'Robust RESTful APIs and backend services. Scalable architectures with proper authentication, rate limiting, and comprehensive documentation.',
  },
  {
    icon: Database,
    title: 'Database Design',
    description:
      'Efficient SQL and NoSQL architectures. Optimized queries, data modeling, migration strategies, and performance tuning for growing applications.',
  },
  {
    icon: Rocket,
    title: 'Technical Consulting',
    description:
      'Strategic guidance on tech stack selection, architecture decisions, and best practices. From proof-of-concept to production deployment.',
  },
];

export default function Services() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <section id="services" className="py-20 lg:py-28 px-6 bg-white/[0.01]">
      <div className="max-w-container mx-auto">
        <SectionHeader
          label="// What I Do"
          title="Services that drive results"
          description="I offer a range of services to help bring your ideas to life — from concept and design through to deployment and beyond."
        />

        <div
          ref={ref}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.09 }}
                className="group relative bg-bg-card border border-white/[0.06] rounded-2xl p-7 hover:border-accent/20 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-accent/[0.04] transition-all duration-300 overflow-hidden"
              >
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent to-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                <div className="w-12 h-12 rounded-xl bg-accent-dim flex items-center justify-center mb-5">
                  <Icon size={22} className="text-accent" />
                </div>

                <h3 className="font-display font-bold text-lg text-text-primary mb-3">
                  {service.title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
