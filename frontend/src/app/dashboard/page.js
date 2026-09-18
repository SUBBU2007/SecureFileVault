'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import UploadDropzone from '@/components/UploadDropzone';
import FileList from '@/components/FileList';

export default function Dashboard() {
  const { token, loading } = useAuth();
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!loading && !token) router.push('/login');
  }, [loading, token]);

  if (loading || !token) return null;

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="mb-6 text-lg font-medium">Your files</h1>
        <div className="mb-8">
          <UploadDropzone onUploaded={() => setRefreshKey((k) => k + 1)} />
        </div>
        <FileList refreshKey={refreshKey} />
      </main>
    </div>
  );
}