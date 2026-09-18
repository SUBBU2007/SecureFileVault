'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import api from '@/lib/api';
import { Users, HardDrive, ScrollText } from 'lucide-react';

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 rounded-md border p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
      <Icon size={20} style={{ color: 'var(--vault)' }} />
      <div>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
        <p className="display text-xl">{value}</p>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { token, role, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && (!token || role !== 'admin')) {
      router.push('/dashboard');
    }
  }, [loading, token, role]);

  useEffect(() => {
    if (role !== 'admin') return;
    const fetchAll = async () => {
      const [usersRes, statsRes, logsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/storage-stats'),
        api.get('/admin/logs'),
      ]);
      setUsers(usersRes.data.users);
      setStats(statsRes.data);
      setLogs(logsRes.data.logs);
      setFetching(false);
    };
    fetchAll();
  }, [role]);

  if (loading || role !== 'admin') return null;

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="display mb-6 text-xl">Admin</h1>

        {fetching ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
        ) : (
          <>
            <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
              <StatCard icon={Users} label="Total users" value={users.length} />
              <StatCard icon={HardDrive} label="Files stored" value={stats.totalFiles} />
              <StatCard icon={HardDrive} label="Storage used" value={`${(stats.totalSizeBytes / 1024 / 1024).toFixed(2)} MB`} />
            </div>

            <h2 className="mb-3 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Users</h2>
            <table className="mb-10 w-full text-sm">
              <thead>
                <tr className="border-b text-left" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                  <th className="py-2 font-normal">Email</th>
                  <th className="py-2 font-normal">Role</th>
                  <th className="py-2 font-normal">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b" style={{ borderColor: 'var(--border)' }}>
                    <td className="py-3">{u.email}</td>
                    <td className="py-3" style={{ color: u.role === 'admin' ? 'var(--vault)' : 'var(--text-muted)' }}>{u.role}</td>
                    <td className="py-3" style={{ color: 'var(--text-muted)' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h2 className="mb-3 flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
              <ScrollText size={14} /> Activity log
            </h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                  <th className="py-2 font-normal">User</th>
                  <th className="py-2 font-normal">Action</th>
                  <th className="py-2 font-normal">File</th>
                  <th className="py-2 font-normal">Time</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l) => (
                  <tr key={l._id} className="border-b" style={{ borderColor: 'var(--border)' }}>
                    <td className="py-3">{l.user?.email || '-'}</td>
                    <td className="py-3 capitalize">{l.action.replace('_', ' ')}</td>
                    <td className="py-3" style={{ color: 'var(--text-muted)' }}>{l.fileName || '-'}</td>
                    <td className="py-3" style={{ color: 'var(--text-muted)' }}>{new Date(l.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </main>
    </div>
  );
}