'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldCheck, Copy, ScrollText } from 'lucide-react';
import Link from 'next/link';
import Preloader from '@/components/Preloader';

const features = [
  { icon: ShieldCheck, title: 'Encrypted before it ever lands', desc: 'Files are AES-256 encrypted on the backend before they touch storage — not after, not optionally.' },
  { icon: Copy, title: 'No wasted storage', desc: 'Every upload is hashed with SHA-256. Duplicate files are detected and referenced, never stored twice.' },
  { icon: Lock, title: 'Access is enforced, not assumed', desc: 'JWT authentication and role-based access control gate every request — verified server-side, every time.' },
  { icon: ScrollText, title: 'Every action, on record', desc: 'Uploads, downloads, deletions — logged for audit, visible to admins, invisible to no one.' },
];

const heroVariants = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } };

export default function LandingPage() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <AnimatePresence>
        {loading && <Preloader onDone={() => setLoading(false)} />}
      </AnimatePresence>

      <main>
        <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <motion.div
            variants={heroVariants}
            initial="hidden"
            animate={!loading ? "show" : "hidden"}
          >
            <motion.div
              variants={itemVariants}
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <Lock size={26} style={{ color: "var(--vault)" }} />
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="display max-w-2xl text-4xl font-medium leading-tight md:text-5xl"
            >
              Your files, actually protected.
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="mx-auto mt-4 max-w-md text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              Not "stored in the cloud." Encrypted, access-controlled, and
              deduplicated — with the mechanics visible, not hidden.
            </motion.p>
            <motion.div variants={itemVariants}>
              <Link
                href="/register"
                className="mt-8 inline-block rounded-full px-6 py-2.5 text-sm font-medium"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                Get started
              </Link>
            </motion.div>
          </motion.div>
        </section>

        <motion.section
          className="mx-auto max-w-4xl px-6 pb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {features.map((f, i) => (
              <div key={i} className="flex gap-4">
                <f.icon
                  size={20}
                  style={{ color: "var(--vault)" }}
                  className="mt-1 shrink-0"
                />
                <div>
                  <h3 className="mb-1 text-sm font-medium">{f.title}</h3>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </main>
    </>
  );
}