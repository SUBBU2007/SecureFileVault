'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setErrorMsg(data.message || 'Registration failed');
        return;
      }

      router.push('/login');
    } catch (err) {
      setStatus('error');
      setErrorMsg('Could not reach the server');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-md border p-6"
        style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
      >
        <h1 className="mb-1 text-lg font-medium">Create an account</h1>
        <p className="mb-6 text-sm" style={{ color: 'var(--text-muted)' }}>
          Your files are encrypted before they ever leave the backend
        </p>

        <label className="mb-1 block text-sm" style={{ color: 'var(--text-muted)' }}>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
          className="mb-4 w-full rounded border bg-transparent px-3 py-2 text-sm outline-none"
          style={{ borderColor: 'var(--border)' }} />

        <label className="mb-1 block text-sm" style={{ color: 'var(--text-muted)' }}>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
          className="mb-5 w-full rounded border bg-transparent px-3 py-2 text-sm outline-none"
          style={{ borderColor: 'var(--border)' }} />

        <button type="submit" disabled={status === 'submitting'}
          className="w-full rounded py-2 text-sm font-medium"
          style={{ background: 'var(--accent)', color: '#fff' }}>
          {status === 'submitting' ? 'Creating account...' : 'Create account'}
        </button>

        {status === 'error' && (
          <p className="mt-3 text-sm" style={{ color: 'var(--danger)' }}>{errorMsg}</p>
        )}

        <p className="mt-5 text-sm" style={{ color: 'var(--text-muted)' }}>
          Already have an account? <a href="/login" style={{ color: 'var(--accent)' }}>Sign in</a>
        </p>
      </form>
    </main>
  );
}