'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Lock, UploadCloud } from 'lucide-react';
import api from '@/lib/api';

export default function UploadDropzone({ onUploaded }) {
  const [phase, setPhase] = useState('idle'); // idle | uploading | processing | done | error
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setPhase('uploading');
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/files/upload', formData, {
        onUploadProgress: (e) => {
          const pct = Math.round((e.loaded * 100) / e.total);
          setProgress(pct);
          if (pct === 100) setPhase('processing');
        },
      });
      setMessage(res.data.message);
      setPhase('done');
      onUploaded?.();
      setTimeout(() => setPhase('idle'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Upload failed');
      setPhase('error');
    }
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        handleFile(e.dataTransfer.files[0]);
      }}
      onClick={() => inputRef.current?.click()}
      className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-md border border-dashed py-10 text-sm"
      style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
    >
      <input
        ref={inputRef}
        type="file"
        hidden
        onChange={(e) => handleFile(e.target.files[0])}
      />

      {phase === 'idle' && (
        <>
          <UploadCloud size={22} />
          <p>Drag a file here, or click to browse</p>
        </>
      )}

      {phase === 'uploading' && <p>Uploading... {progress}%</p>}
      {phase === 'processing' && <p>Encrypting &amp; checking for duplicates...</p>}

      {phase === 'done' && (
        <motion.div
          className="flex items-center gap-2"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <motion.div
            initial={{ rotate: -20 }}
            animate={{ rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Lock size={18} style={{ color: 'var(--verified)' }} />
          </motion.div>
          <span style={{ color: 'var(--verified)' }}>{message}</span>
        </motion.div>
      )}

      {phase === 'error' && <p style={{ color: 'var(--danger)' }}>{message}</p>}
    </div>
  );
}