'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowUpRight, Github } from 'lucide-react';
import api from '@/lib/api';
import { fallbackProjects } from '@/lib/projects-data';
import type { Project } from '@/types';
import SectionHeader from './SectionHeader';

/* Gradient presets for project preview areas */
const gradients = [
  'from-accent/20 via-secondary/10 to-accent/5',
  'from-secondary/20 via-accent/10 to-secondary/5',
  'from-warm/20 via-secondary/10 to-warm/5',
  'from-accent/15 via-warm/10 to-accent/5',
];

/* Emoji icons for project cards */
const emojis = ['📊', '🛒', '📋', '🤖'];

/* Tag color mapping */
function tagColor(tag: string): string {
  const frameworks = ['React', 'Next.js', 'Flask', 'Node.js', 'Express'];
  const tools = ['MongoDB', 'PostgreSQL', 'Socket.io', 'REST API', 'Stripe'];

  if (frameworks.includes(tag)) return 'bg-accent/10 text-accent border-accent/20';
  if (tools.includes(tag)) return 'bg-secondary/10 text-secondary border-secondary/20';
  return 'bg-warm/10 text-warm border-warm/20';
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects as Project[]);
  const [loading, setLoading] = useState(true);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data } = await api.get<Project[]>('/projects');
        if (data && data.length > 0) setProjects(data);
      } catch {
        /* silently use fallback */
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  return (
    <section id="projects" className="py-20 lg:py-28 px-6">
      <div className="max-w-container mx-auto">
        <SectionHeader
          label="// Selected Work"
          title="Projects I've built"
          description="A selection of recent projects showcasing my skills across full-stack development, data analysis, and AI."
        />

        <div ref={ref} className="grid md:grid-cols-2 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-bg-card border border-white/[0.06] rounded-2xl overflow-hidden animate-pulse"
                >
                  <div className="h-52 bg-white/[0.03]" />
                  <div className="p-6 space-y-4">
                    <div className="flex gap-2">
                      <div className="h-6 w-16 bg-white/[0.06] rounded-md" />
                      <div className="h-6 w-20 bg-white/[0.06] rounded-md" />
                      <div className="h-6 w-14 bg-white/[0.06] rounded-md" />
                    </div>
                    <div className="h-6 w-3/4 bg-white/[0.06] rounded" />
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-white/[0.04] rounded" />
                      <div className="h-4 w-5/6 bg-white/[0.04] rounded" />
                    </div>
                    <div className="flex gap-5">
                      <div className="h-4 w-20 bg-white/[0.06] rounded" />
                      <div className="h-4 w-16 bg-white/[0.06] rounded" />
                    </div>
                  </div>
                </div>
              ))
            : projects.map((project, i) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group bg-bg-card border border-white/[0.06] rounded-2xl overflow-hidden hover:border-accent/20 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-accent/[0.04] transition-all duration-300"
            >
              {/* Gradient preview area */}
              <div
                className={`relative h-52 bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center`}
              >
                <span className="text-6xl transition-transform duration-300 group-hover:scale-125">
                  {emojis[i % emojis.length]}
                </span>
              </div>

              {/* Card body */}
              <div className="p-6">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-2.5 py-1 rounded-md text-xs font-mono border ${tagColor(tag)}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h3 className="font-display font-bold text-xl text-text-primary mb-2">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-text-muted text-sm leading-relaxed mb-5 line-clamp-3">
                  {project.description}
                </p>

                {/* Links */}
                <div className="flex items-center gap-5">
                  {project.liveUrl && project.liveUrl !== '#' ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline underline-offset-4 transition-colors"
                    >
                      Live Demo
                      <ArrowUpRight size={15} />
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted/50 cursor-default">
                      Coming Soon
                    </span>
                  )}
                  {project.githubUrl && project.githubUrl !== '#' ? (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-text-primary transition-colors"
                    >
                      <Github size={15} />
                      GitHub
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted/30 cursor-default">
                      <Github size={15} />
                      Private
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))
          }
        </div>
      </div>
    </section>
  );
}
