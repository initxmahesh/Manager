'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/shared/sidebar';
import { Header } from '@/components/shared/header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // We'll pass lastSynced from a context or prop in a real scenario
  // For now, we use a simple state that pages can update
  const [lastSynced] = useState<Date | null>(null);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} lastSynced={lastSynced} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
