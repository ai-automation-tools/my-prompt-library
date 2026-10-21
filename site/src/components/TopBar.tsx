/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { type ReactNode } from 'react';
import { ChevronRight, PanelLeft, Plus, Search } from 'lucide-react';
import { cn } from '../lib/cn';
import { READ_ONLY } from '../lib/mode';
import ResourcesNav from './ResourcesNav';
import { Button, IconButton, Kbd, MOD_KEY } from './ui/primitives';

export interface Crumb {
  label: ReactNode;
  onClick?: () => void;
}

interface TopBarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  crumbs: Crumb[];
  onOpenPalette: () => void;
  onNewPrompt: () => void;
}

/**
 * The bar above the content: sidebar toggle, breadcrumbs, the ⌘K search
 * trigger, the resources menu and "New prompt" (not on the read-only demo).
 */
export default function TopBar({
  sidebarOpen,
  onToggleSidebar,
  crumbs,
  onOpenPalette,
  onNewPrompt,
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

      {!READ_ONLY && (
        <Button variant="primary" size="sm" icon={<Plus className="h-3.5 w-3.5" />} onClick={onNewPrompt} className="hidden sm:inline-flex">
          New prompt
        </Button>
      )}
    </header>
  );
}
