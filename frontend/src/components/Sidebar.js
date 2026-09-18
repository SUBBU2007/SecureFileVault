'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Sidebar() {
  const { role, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const navItem = (href, label) => (
    <Link
      href={href}
      className="rounded px-2 py-1.5 transition-colors"
      style={{
        color: pathname === href ? 'var(--text)' : 'var(--text-muted)',
        background: pathname === href ? 'var(--border)' : 'transparent',
      }}
    >
      {label}
    </Link>
  );

  return (
    <aside className="flex h-screen w-56 flex-col justify-between border-r p-4" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
      <div>
        <p className="display mb-6 text-sm">Secure Vault</p>
        <nav className="flex flex-col gap-1 text-sm">
          {navItem('/dashboard', 'Files')}
          {role === 'admin' && navItem('/admin', 'Admin')}
        </nav>
      </div>
      <button onClick={() => { logout(); router.push('/login'); }} className="text-left text-sm" style={{ color: 'var(--text-muted)' }}>
        Log out
      </button>
    </aside>
  );
}