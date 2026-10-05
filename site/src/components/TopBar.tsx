/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronRight, LogOut, PanelLeft, Plus, Search, UserRound } from 'lucide-react';
import { AnimatePresence, m } from 'motion/react';
import { cn } from '../lib/cn';
import ResourcesNav from './ResourcesNav';
import { Button, IconButton, Kbd, MOD_KEY } from './ui/primitives';

export interface TopBarUser {
  email: string;
  name: string | null;
}

export interface Crumb {
  label: ReactNode;
  onClick?: () => void;
}

interface TopBarProps {
  user: TopBarUser | null;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  crumbs: Crumb[];
  onOpenPalette: () => void;
  onNewPrompt: () => void;
  onLogin: () => void;
  onSignup: () => void;
  onLogout: () => void;
}

/**
 * The bar above the content: sidebar toggle, breadcrumbs, the ⌘K search
 * trigger, the resources menu, "New prompt" and the account menu.
 */
export default function TopBar({
  user,
  sidebarOpen,
  onToggleSidebar,
  crumbs,
  onOpenPalette,
  onNewPrompt,
  onLogin,
  onSignup,
  onLogout,
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-2 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--bg)_82%,transparent)] px-3 backdrop-blur-xl md:px-4">
      <IconButton label={sidebarOpen ? 'Hide navigation' : 'Show navigation'} onClick={onToggleSidebar}>
        <PanelLeft className="h-4 w-4" />
      </IconButton>

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="hidden min-w-0 flex-1 items-center sm:flex">
        <ol className="flex min-w-0 items-center gap-1 text-[13px]">
          {crumbs.map((crumb, i) => {
            const last = i === crumbs.length - 1;
            return (
              <li
                key={i}
                className={cn(
                  'flex items-center gap-1',
                  last ? 'min-w-0 shrink' : 'shrink-0',
                  // Middle crumbs fold away first; the library crumb only shows on wide screens.
                  !last && i === 0 && 'hidden xl:flex',
                  !last && i > 0 && 'hidden lg:flex',
                )}
              >
                {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[var(--fg-5)]" />}
                {crumb.onClick && !last ? (
                  <button
                    type="button"
                    onClick={crumb.onClick}
                    className="max-w-[12rem] truncate rounded px-1 py-0.5 text-[var(--fg-4)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--fg)]"
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span
                    aria-current={last ? 'page' : undefined}
                    className={cn('truncate px-1 py-0.5', last ? 'font-medium text-[var(--fg)]' : 'text-[var(--fg-4)]')}
                  >
                    {crumb.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <div className="flex-1 sm:hidden" />

      {/* Search trigger */}
      <button
        type="button"
        onClick={onOpenPalette}
        className="group flex h-9 w-9 items-center justify-center gap-2 rounded-[var(--r-md)] border border-[var(--line-2)] bg-[var(--surface)] text-[var(--fg-4)] transition-colors hover:border-[color-mix(in_srgb,var(--accent)_45%,var(--line-2))] hover:text-[var(--fg-2)] md:w-64 md:justify-start md:px-3"
        aria-label="Search the library"
      >
        <Search className="h-4 w-4 shrink-0 transition-colors group-hover:text-[var(--accent)]" />
        <span className="hidden flex-1 text-left text-[13px] md:block">Search library…</span>
        <span className="hidden items-center gap-1 md:flex">
          <Kbd>{MOD_KEY}</Kbd>
          <Kbd>K</Kbd>
        </span>
      </button>

      <ResourcesNav />

      <Button variant="primary" size="sm" icon={<Plus className="h-3.5 w-3.5" />} onClick={onNewPrompt} className="hidden sm:inline-flex">
        New prompt
      </Button>

      {user ? (
        <UserMenu user={user} onLogout={onLogout} />
      ) : (
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="sm" onClick={onLogin}>
            Log in
          </Button>
          <Button variant="outline" size="sm" onClick={onSignup} className="hidden sm:inline-flex">
            Sign up
          </Button>
        </div>
      )}
    </header>
  );
}

function initialsOf(user: TopBarUser): string {
  const source = (user.name || user.email).trim();
  const parts = source.split(/[\s._-]+/).filter(Boolean);
  const letters = parts.length > 1 ? parts[0][0] + parts[1][0] : source.slice(0, 2);
  return letters.toUpperCase();
}

function UserMenu({ user, onLogout }: { user: TopBarUser; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account"
        className={cn(
          'grid h-9 w-9 place-items-center rounded-full border text-[11.5px] font-semibold transition-colors',
          'border-[var(--line-2)] bg-[var(--surface)] text-[var(--fg-2)] hover:border-[var(--accent)] hover:text-[var(--fg)]',
          open && 'border-[var(--accent)]',
        )}
      >
        {initialsOf(user)}
      </button>
      <AnimatePresence>
        {open && (
          <m.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.2, 0.7, 0.2, 1] }}
            className="popover absolute right-0 top-full z-[100] mt-2 w-64 p-1.5"
          >
            <div className="flex items-center gap-3 px-2.5 py-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--tint)] text-[var(--accent)]">
                <UserRound className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[13.5px] font-medium text-[var(--fg)]">{user.name || 'Signed in'}</span>
                <span className="block truncate text-[12px] text-[var(--fg-4)]">{user.email}</span>
              </span>
            </div>
            <div className="my-1 h-px bg-[var(--line)]" />
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              className="flex w-full items-center gap-2.5 rounded-[var(--r-md)] px-2.5 py-2 text-left text-[13px] text-[var(--fg-3)] transition-colors hover:bg-[color-mix(in_srgb,var(--danger)_10%,transparent)] hover:text-[var(--danger)]"
            >
              <LogOut className="h-3.5 w-3.5" />
              Log out
            </button>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
