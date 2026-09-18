'use client';

import { motion } from 'framer-motion';
import { Lock, LockOpen } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Preloader({ onDone }) {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setUnlocked(true), 500);
    const t2 = setTimeout(() => onDone?.(), 1100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'var(--bg)' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div animate={{ rotate: unlocked ? [0, -8, 0] : 0 }} transition={{ duration: 0.4 }}>
        {unlocked ? <LockOpen size={28} style={{ color: 'var(--vault)' }} /> : <Lock size={28} style={{ color: 'var(--text-muted)' }} />}
      </motion.div>
    </motion.div>
  );
}