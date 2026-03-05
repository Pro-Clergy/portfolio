'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageSquare, X, Send, Loader2, Bot } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const WELCOME: Message = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hi! 👋 I'm Mathias's AI assistant. Ask me anything about his skills, projects, or how to get in touch!",
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* Scroll to newest message */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* Focus input when panel opens */
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open]);

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: Message = { id: makeId(), role: 'user', content: text };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
        }),
      });

      const data = (await res.json()) as { reply?: string; error?: string };

      if (!res.ok || data.error) {
        setError(data.error ?? 'Something went wrong. Please try again.');
      } else if (data.reply) {
        setMessages((prev) => [...prev, { id: makeId(), role: 'assistant', content: data.reply! }]);
      }
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── Chat panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[22rem] max-w-[calc(100vw-3rem)] flex flex-col rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/[0.08] bg-bg-card"
            role="dialog"
            aria-label="Chat with Mathias's AI assistant"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.06] bg-bg-primary/80">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/20 border border-accent/30 shrink-0">
                <Bot size={16} className="text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-text-primary text-sm font-semibold leading-none truncate">
                  Mathias AI
                </p>
                <p className="text-accent text-xs mt-0.5 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />
                  Online
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-text-muted hover:text-text-primary transition-colors p-1 rounded-lg hover:bg-white/[0.05]"
                aria-label="Close chat"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-80 min-h-[12rem]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-accent text-bg-primary font-medium'
                        : 'bg-bg-primary/80 text-text-primary border border-white/[0.06]'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-bg-primary/80 border border-white/[0.06] px-3 py-2 rounded-xl">
                    <Loader2 size={14} className="text-accent animate-spin" />
                  </div>
                </div>
              )}

              {error && (
                <div className="flex justify-start">
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-2 rounded-xl text-sm">
                    {error}
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={sendMessage}
              className="flex items-center gap-2 px-3 py-3 border-t border-white/[0.06] bg-bg-primary/60"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything…"
                disabled={loading}
                maxLength={500}
                className="flex-1 bg-bg-primary border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20 transition-all duration-200 disabled:opacity-50"
                aria-label="Chat input"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="flex items-center justify-center w-9 h-9 rounded-xl bg-accent text-bg-primary hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shrink-0"
                aria-label="Send message"
              >
                <Send size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Trigger button ── */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-accent text-bg-primary shadow-lg shadow-accent/30 hover:brightness-110 transition-all duration-300"
        aria-label={open ? 'Close chat' : 'Open chat with Mathias AI'}
        aria-expanded={open}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={22} />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageSquare size={22} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
