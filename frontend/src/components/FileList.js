'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';

export default function FileList({ refreshKey }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null); // tracks which row is mid-action
  const [confirmId, setConfirmId] = useState(null);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await api.get('/files/my-files');
      setFiles(res.data.files);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFiles(); }, [refreshKey]);

  const handleDownload = async (file) => {
    setBusyId(file._id);
    const res = await fetch(`http://localhost:5000/api/files/download/${file._id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.originalName;
    a.click();
    URL.revokeObjectURL(url);
    setBusyId(null);
  };

  const handleDelete = async (fileId) => {
    setBusyId(fileId);
    try {
      await api.delete(`/files/${fileId}`);
      setFiles((prev) => prev.filter((f) => f._id !== fileId));
    } finally {
      setBusyId(null);
      setConfirmId(null);
    }
  };

  if (loading) return <p style={{ color: 'var(--text-muted)' }}>Loading files...</p>;
  if (files.length === 0) {
    return <p className="py-6 text-sm" style={{ color: 'var(--text-muted)' }}>No files yet. Upload one above to get started.</p>;
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b text-left" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
          <th className="py-2 font-normal">Name</th>
          <th className="py-2 font-normal">Size</th>
          <th className="py-2 font-normal">Hash</th>
          <th className="py-2 font-normal">Uploaded</th>
          <th className="py-2 font-normal"></th>
        </tr>
      </thead>
      <tbody>
        {files.map((f) => (
          <tr key={f._id} className="border-b" style={{ borderColor: 'var(--border)' }}>
            <td className="py-3">{f.originalName}</td>
            <td className="py-3" style={{ color: 'var(--text-muted)' }}>{(f.size / 1024).toFixed(1)} KB</td>
            <td className="mono py-3" style={{ color: 'var(--text-muted)' }}>{f.hash.slice(0, 12)}...</td>
            <td className="py-3" style={{ color: 'var(--text-muted)' }}>{new Date(f.createdAt).toLocaleDateString()}</td>
            <td className="py-3 text-right">
              {confirmId === f._id ? (
                <span className="flex items-center justify-end gap-3">
                  <span style={{ color: 'var(--text-muted)' }}>Delete this file?</span>
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleDelete(f._id)} disabled={busyId === f._id} style={{ color: 'var(--danger)' }}>
                    {busyId === f._id ? 'Deleting...' : 'Confirm'}
                  </motion.button>
                  <button onClick={() => setConfirmId(null)} style={{ color: 'var(--text-muted)' }}>Cancel</button>
                </span>
              ) : (
                <span className="flex items-center justify-end gap-4">
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleDownload(f)} disabled={busyId === f._id} style={{ color: 'var(--accent)' }}>
                    {busyId === f._id ? 'Downloading...' : 'Download'}
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => setConfirmId(f._id)} style={{ color: 'var(--text-muted)' }}>
                    Delete
                  </motion.button>
                </span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}