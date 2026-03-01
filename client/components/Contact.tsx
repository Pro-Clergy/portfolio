'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Mail, MapPin, Briefcase, Send, Loader2, CheckCircle2 } from 'lucide-react';
import api from '@/lib/api';
import SectionHeader from './SectionHeader';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email'),
  subject: z.string().max(200).optional().or(z.literal('')),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must be under 5000 characters'),
});

type ContactForm = z.infer<typeof contactSchema>;

const infoCards = [
  { icon: Mail, label: 'Email', value: 'mathiaskuamiclergy2002@gmail.com', href: 'mailto:mathiaskuamiclergy2002@gmail.com' },
  { icon: MapPin, label: 'Location', value: 'Kumasi, Ghana 🇬🇭' },
  { icon: Briefcase, label: 'Status', value: 'Open to opportunities' },
];

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    setLoading(true);
    try {
      const response = await api.post('/contact', data);
      if (response.data.success) {
        toast.success('Message sent successfully!');
        reset();
        setSubmitted(true);
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { error?: string; errors?: Array<{ msg: string }> } } };
        const message =
          axiosErr.response?.data?.error ||
          axiosErr.response?.data?.errors?.[0]?.msg ||
          'Something went wrong. Please try again.';
        toast.error(message);
      } else {
        toast.error('Network error. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    'w-full bg-bg-primary border border-white/[0.08] rounded-xl px-4 py-3.5 text-text-primary placeholder:text-text-muted/50 font-body text-sm focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20 transition-all duration-200';

  return (
    <section id="contact" className="py-20 lg:py-28 px-6">
      <div className="max-w-container mx-auto">
        <SectionHeader
          label="// Get In Touch"
          title="Let's work together"
          description="Have a project in mind, a question, or just want to say hello? I'd love to hear from you."
        />

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative bg-bg-card border border-white/[0.06] rounded-3xl p-8 lg:p-12 overflow-hidden"
        >
          {/* Glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl glow-blob pointer-events-none -translate-y-1/3 translate-x-1/4" />

          {/* Info cards */}
          <div className="relative grid sm:grid-cols-3 gap-4 mb-10">
            {infoCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                  className="bg-bg-primary/60 border border-white/[0.06] rounded-2xl p-5 text-center"
                >
                  <Icon size={20} className="text-accent mx-auto mb-2" />
                  <p className="text-text-muted text-xs uppercase tracking-wider mb-1">
                    {card.label}
                  </p>
                  <p className="text-text-primary font-medium text-sm">{card.value}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Form */}
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative text-center py-16"
            >
              <CheckCircle2 size={48} className="text-accent mx-auto mb-4" />
              <h3 className="font-display font-bold text-2xl text-text-primary mb-2">
                Message sent!
              </h3>
              <p className="text-text-muted text-lg mb-6">
                Thank you for reaching out. I&apos;ll get back to you as soon as possible.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-accent font-medium hover:underline underline-offset-4"
              >
                Send another message
              </button>
            </motion.div>
          ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-5" noValidate>
            {/* Honeypot field — hidden from real users, bots fill it */}
            <div className="absolute -left-[9999px]" aria-hidden="true">
              <label htmlFor="contact-website">Website</label>
              <input
                id="contact-website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="contact-name" className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-2">Name *</label>
                <input
                  id="contact-name"
                  {...register('name')}
                  placeholder="John Doe"
                  className={inputClasses}
                />
                {errors.name && (
                  <p className="mt-1.5 text-xs text-red-400" role="alert">{errors.name.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-2">Email *</label>
                <input
                  id="contact-email"
                  {...register('email')}
                  type="email"
                  placeholder="john@example.com"
                  className={inputClasses}
                />
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-400" role="alert">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="contact-subject" className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-2">Subject</label>
              <input
                id="contact-subject"
                {...register('subject')}
                placeholder="What's this about?"
                className={inputClasses}
              />
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-2">Message *</label>
              <textarea
                id="contact-message"
                {...register('message')}
                rows={6}
                placeholder="Tell me about your project..."
                className={`${inputClasses} resize-none`}
              />
              {errors.message && (
                <p className="mt-1.5 text-xs text-red-400" role="alert">{errors.message.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent text-bg-primary font-body font-semibold rounded-xl hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send Message
                </>
              )}
            </button>
          </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
