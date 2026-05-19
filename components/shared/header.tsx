'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './theme-toggle';
import { SyncIndicator } from './sync-indicator';

interface HeaderProps {
  onMenuClick: () => void;
  lastSynced: Date | null;
}

export function Header({ onMenuClick, lastSynced }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-card/80 px-4 backdrop-blur-sm md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 md:hidden"
        onClick={onMenuClick}
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="hidden md:block" />

      <div className="flex items-center gap-3">
        <SyncIndicator lastSynced={lastSynced} />
        <ThemeToggle />
      </div>
    </header>
  );
}
