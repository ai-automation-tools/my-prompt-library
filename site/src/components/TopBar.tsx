/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Menu, PanelLeft, Plus, Search, X } from 'lucide-react';
import { LayoutGroup, m } from 'motion/react';
import { SECTIONS } from '../lib/sections';
import type { LibraryTab } from '../hooks/useLibraryRoute';
import type { Theme } from '../hooks/useTheme';
import { READ_ONLY } from '../lib/mode';
import ResourcesNav from './ResourcesNav';
import ThemeSwitch from './ThemeSwitch';
import { Button, IconButton, Kbd, MOD_KEY } from './ui/primitives';

interface TopBarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  activeTab: LibraryTab;
  onSelectSection: (tab: LibraryTab) => void;
  onOpenPalette: () => void;
  onNewPrompt: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

/**
 * The house-style top bar: categories toggle, brand, the six sections as nav
 * links (a sliding underline marks the current one), then ⌘K, Resources,
 * New prompt and the Light | Dark switch. Below 1280px the sections fold into
 * a sheet under the bar, opened by the menu button.
 */
export default function TopBar({
  sidebarOpen,
  onToggleSidebar,
  activeTab,
  onSelectSection,
  onOpenPalette,
  onNewPrompt,
  theme,
  setTheme,
}: TopBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const pick = (tab: LibraryTab) => {
    onSelectSection(tab);
    setMenuOpen(false);
  };

  return (
    <>
      <header className="topbar">
        <IconButton label={sidebarOpen ? 'Hide categories' : 'Show categories'} onClick={onToggleSidebar} aria-expanded={sidebarOpen}>
          <PanelLeft className="h-4 w-4" />
        </IconButton>

        <button type="button" className="brand" onClick={() => pick('prompt-library')} aria-label="My Prompt Library home">
          <img src="/favicon.svg" alt="" width={24} height={24} />
          {/* The wordmark only where the six section links leave room beside it. */}
          <span className="hidden 2xl:inline">My Prompt Library</span>
        </button>

        <nav className="nav" aria-label="Sections">
          <LayoutGroup id="section-nav">
            {SECTIONS.map(section => {
              const active = section.id === activeTab;
              return (
                <button
                  key={section.id}
                  type="button"
                  aria-current={active ? 'true' : undefined}
                  onClick={() => pick(section.id)}
                  style={{ ['--c' as string]: section.accent }}
                >
                  {section.label}
                  {active && (
                    <m.span
                      layoutId="section-nav-ind"
                      className="ind"
                      aria-hidden="true"
                      transition={{ type: 'spring', stiffness: 500, damping: 42 }}
                    />
                  )}
                </button>
              );
            })}
          </LayoutGroup>
        </nav>

        <div className="topbar-right">
          <button type="button" className="kbd-btn" onClick={onOpenPalette} aria-label="Search the library">
            <Search className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden 2xl:inline">Search…</span>
            <Kbd>{MOD_KEY}</Kbd>
            <Kbd>K</Kbd>
          </button>

          <IconButton label="Search the library" onClick={onOpenPalette} className="md:hidden">
            <Search className="h-4 w-4" />
          </IconButton>

          <ResourcesNav />

          {!READ_ONLY && (
            <Button variant="primary" size="sm" icon={<Plus className="h-3.5 w-3.5" />} onClick={onNewPrompt} className="hidden sm:inline-flex">
              New prompt
            </Button>
          )}

          <ThemeSwitch theme={theme} setTheme={setTheme} />

          <button
            type="button"
            className="menu-btn"
            onClick={() => setMenuOpen(o => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </header>

      <nav id="mobile-nav" className={menuOpen ? 'mobile-nav open' : 'mobile-nav'} aria-label="Sections">
        {SECTIONS.map(section => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              type="button"
              aria-current={section.id === activeTab ? 'true' : undefined}
              onClick={() => pick(section.id)}
              style={{ ['--c' as string]: section.accent }}
            >
              <Icon className="h-4 w-4 text-[var(--c)]" aria-hidden="true" />
              {section.label}
            </button>
          );
        })}
      </nav>
    </>
  );
}
