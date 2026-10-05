/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo, useState } from 'react';
import { BookOpen, ChevronDown, FolderOpen, Layers, Library, Package, Search, X } from 'lucide-react';
import { AnimatePresence, LayoutGroup, m } from 'motion/react';
import { cn } from '../lib/cn';
import { SECTIONS, humanize } from '../lib/sections';
import type { Theme } from '../lib/themes';
import type { LibraryTab } from '../hooks/useLibraryRoute';
import type { Prompt } from './PromptCard';
import ThemePicker from './ThemePicker';

export type { Theme } from '../lib/themes';

export interface SkillPackSummary {
  id: string;
  name: string;
  description: string;
  icon: string;
  version: string;
  tags: string[];
  category: string;
  skillCount: number;
  author: string;
  created_at: string;
  updated_at: string;
}

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  libraryMode: 'public' | 'my';
  setLibraryMode: (mode: 'public' | 'my') => void;
  activeTab: LibraryTab;
  setActiveTab: (tab: LibraryTab) => void;
  /** Prompt count per section, for the nav badges. */
  sectionCounts: Partial<Record<LibraryTab, number>>;
  skillPacks: SkillPackSummary[];
  categories: Record<string, Set<string>>;
  sectionPrompts: Prompt[];
  expandedCategories: Record<string, boolean>;
  setExpandedCategories: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  toggleCategory: (cat: string) => void;
  selectedSubcategory: { category: string; subcategory: string | 'ALL' } | null;
  handleSubcategoryClick: (category: string, subcategory: string | 'ALL') => void;
  handleShowAllPrompts: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const SIDEBAR_WIDTH = 272;

/** The brand mark: a small framed glyph in the accent. */
function BrandMark() {
  return (
    <span className="glyph h-8 w-8 rounded-[8px]" style={{ ['--c' as string]: 'var(--accent)' }}>
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.5l2.4 5.2 5.6.8-4.1 4 1 5.6L12 15.4l-4.9 2.7 1-5.6-4.1-4 5.6-.8z" />
      </svg>
    </span>
  );
}

export default function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  libraryMode,
  setLibraryMode,
  activeTab,
  setActiveTab,
  sectionCounts,
  skillPacks,
  categories,
  sectionPrompts,
  expandedCategories,
  setExpandedCategories,
  toggleCategory,
  selectedSubcategory,
  handleSubcategoryClick,
  handleShowAllPrompts,
  theme,
  setTheme,
}: SidebarProps) {
  const [categoryFilter, setCategoryFilter] = useState('');

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of sectionPrompts) counts[p.category] = (counts[p.category] ?? 0) + 1;
    return counts;
  }, [sectionPrompts]);

  const packsByCategory = useMemo(() => {
    const map: Record<string, SkillPackSummary[]> = {};
    for (const pack of skillPacks) (map[pack.category] ??= []).push(pack);
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [skillPacks]);

  const categoryNames = useMemo(() => {
    const names = Object.keys(categories).sort();
    const q = categoryFilter.trim().toLowerCase();
    return q ? names.filter(n => n.toLowerCase().includes(q)) : names;
  }, [categories, categoryFilter]);

  const showCategoryFilter = Object.keys(categories).length > 8;

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-50 flex h-full shrink-0 flex-col overflow-hidden',
        'border-r border-[var(--line)] bg-[var(--bg-2)]',
        'transition-[transform,width] duration-500 ease-[cubic-bezier(.2,.7,.2,1)]',
        'md:relative md:translate-x-0',
        'w-[272px]',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:w-0 md:border-r-0',
      )}
      aria-label="Library navigation"
    >
      <div className="flex h-full flex-col" style={{ width: SIDEBAR_WIDTH }}>
        {/* Brand */}
        <div className="flex h-14 shrink-0 items-center gap-3 border-b border-[var(--line)] px-4">
          <button
            type="button"
            onClick={() => {
              setActiveTab('prompt-library');
              handleShowAllPrompts();
            }}
            className="flex min-w-0 flex-1 items-center gap-2.5 rounded-[var(--r-md)] text-left transition-opacity hover:opacity-85"
          >
            <BrandMark />
            <span className="min-w-0">
              <span className="block truncate text-[13.5px] font-semibold tracking-tight text-[var(--fg)]">
                Prompt Library
              </span>
              <span className="eyebrow block text-[9.5px] tracking-[0.16em]">Mike's AI Lab</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="icon-btn md:hidden"
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Library switch */}
        <div className="px-3 pt-3">
          <LayoutGroup id="library-mode">
            <div className="segmented w-full" role="group" aria-label="Library">
              {(
                [
                  { id: 'public', label: 'Public', icon: BookOpen },
                  { id: 'my', label: 'My Library', icon: Library },
                ] as const
              ).map(({ id, label, icon: Icon }) => {
                const active = libraryMode === id;
                return (
                  <button key={id} type="button" aria-pressed={active} onClick={() => setLibraryMode(id)}>
                    {active && (
                      <m.span
                        layoutId="library-mode-thumb"
                        className="segmented-thumb"
                        transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                      />
                    )}
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </button>
                );
              })}
            </div>
          </LayoutGroup>
        </div>

        {/* Sections */}
        <nav className="px-3 pt-4" aria-label="Sections">
          <p className="eyebrow mb-2 px-2">Browse</p>
          <LayoutGroup id="sections">
            <ul className="space-y-0.5">
              {SECTIONS.map(section => {
                const Icon = section.icon;
                const active = activeTab === section.id;
                const count = sectionCounts[section.id];
                return (
                  <li key={section.id}>
                    <button
                      type="button"
                      aria-current={active ? 'page' : undefined}
                      onClick={() => {
                        setActiveTab(section.id);
                        handleShowAllPrompts();
                        if (window.innerWidth < 768) setIsSidebarOpen(false);
                      }}
                      style={{ ['--c' as string]: section.accent }}
                      className={cn(
                        'group relative flex w-full items-center gap-2.5 rounded-[var(--r-md)] px-2 py-[7px] text-left text-[13.5px] transition-colors',
                        active ? 'text-[var(--fg)]' : 'text-[var(--fg-3)] hover:text-[var(--fg)]',
                      )}
                    >
                      {active && (
                        <m.span
                          layoutId="section-active"
                          className="absolute inset-0 rounded-[var(--r-md)] border border-[var(--line)] bg-[var(--surface-2)]"
                          transition={{ type: 'spring', stiffness: 500, damping: 42 }}
                        />
                      )}
                      {active && (
                        <m.span
                          layoutId="section-active-bar"
                          className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-r-full"
                          style={{ background: 'var(--c)', boxShadow: '0 0 10px var(--c)' }}
                          transition={{ type: 'spring', stiffness: 500, damping: 42 }}
                        />
                      )}
                      <span
                        className={cn(
                          'relative grid h-6 w-6 place-items-center rounded-[6px] transition-colors',
                          active
                            ? 'bg-[color-mix(in_srgb,var(--c)_14%,transparent)] text-[var(--c)]'
                            : 'text-[var(--fg-4)] group-hover:text-[var(--c)]',
                        )}
                      >
                        <Icon className="h-[15px] w-[15px]" />
                      </span>
                      <span className="relative flex-1 truncate font-medium">{section.label}</span>
                      {count !== undefined && (
                        <span className="mono relative text-[10.5px] tabular-nums text-[var(--fg-5)] group-hover:text-[var(--fg-4)]">
                          {count.toLocaleString()}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </LayoutGroup>
        </nav>

        {/* Categories */}
        <div className="mt-4 flex min-h-0 flex-1 flex-col border-t border-[var(--line)]">
          <div className="flex items-center justify-between px-5 pb-1.5 pt-3.5">
            <p className="eyebrow">{activeTab === 'skill-packs' ? 'Pack categories' : 'Categories'}</p>
            <span className="mono text-[10.5px] text-[var(--fg-5)]">
              {activeTab === 'skill-packs' ? packsByCategory.length : Object.keys(categories).length}
            </span>
          </div>

          {showCategoryFilter && activeTab !== 'skill-packs' && (
            <div className="relative px-3 pb-2">
              <Search className="pointer-events-none absolute left-5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--fg-4)]" />
              <input
                type="text"
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                placeholder="Filter categories"
                aria-label="Filter categories"
                className="input h-8 pl-8 text-[12.5px]"
              />
            </div>
          )}

          <div className="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-3 pb-3">
            {activeTab === 'skill-packs'
              ? packsByCategory.map(([cat, packs]) => {
                  const expanded = !!expandedCategories[cat];
                  return (
                    <div key={cat}>
                      <CategoryRow
                        icon={Package}
                        label={humanize(cat)}
                        count={packs.length}
                        expanded={expanded}
                        onClick={() => setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }))}
                      />
                      <Collapse open={expanded}>
                        {packs
                          .slice()
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map(pack => (
                            <div
                              key={pack.id}
                              className="flex items-center gap-2 px-2.5 py-1.5 text-[12.5px] text-[var(--fg-4)]"
                            >
                              <span className="text-sm leading-none">{pack.icon}</span>
                              <span className="truncate">{pack.name}</span>
                            </div>
                          ))}
                      </Collapse>
                    </div>
                  );
                })
              : categoryNames.map(cat => {
                  const expanded = !!expandedCategories[cat];
                  const subcategories = Array.from(categories[cat] ?? []).sort();
                  return (
                    <div key={cat}>
                      <CategoryRow
                        icon={FolderOpen}
                        label={humanize(cat)}
                        count={categoryCounts[cat] ?? 0}
                        expanded={expanded}
                        active={selectedSubcategory?.category === cat}
                        onClick={() => toggleCategory(cat)}
                      />
                      <Collapse open={expanded}>
                        <SubcategoryRow
                          icon={Layers}
                          label="All"
                          active={selectedSubcategory?.category === cat && selectedSubcategory.subcategory === 'ALL'}
                          onClick={() => handleSubcategoryClick(cat, 'ALL')}
                        />
                        {subcategories.map(sub => (
                          <SubcategoryRow
                            key={sub}
                            label={humanize(sub)}
                            active={selectedSubcategory?.category === cat && selectedSubcategory.subcategory === sub}
                            onClick={() => handleSubcategoryClick(cat, sub)}
                          />
                        ))}
                      </Collapse>
                    </div>
                  );
                })}
            {activeTab !== 'skill-packs' && categoryNames.length === 0 && (
              <p className="px-2 py-6 text-center text-[12.5px] text-[var(--fg-5)]">
                {categoryFilter ? 'No categories match.' : 'No categories yet.'}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-[var(--line)] p-2.5">
          <ThemePicker theme={theme} setTheme={setTheme} />
        </div>
      </div>
    </aside>
  );
}

function CategoryRow({
  icon: Icon,
  label,
  count,
  expanded,
  active,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  count: number;
  expanded: boolean;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={expanded}
      className={cn(
        'group flex w-full items-center gap-2 rounded-[var(--r-md)] px-2 py-[6px] text-left text-[13px] transition-colors',
        expanded || active
          ? 'bg-[var(--surface)] text-[var(--fg)]'
          : 'text-[var(--fg-3)] hover:bg-[var(--surface)] hover:text-[var(--fg)]',
      )}
    >
      <Icon
        className={cn(
          'h-3.5 w-3.5 shrink-0 transition-colors',
          expanded || active ? 'text-[var(--c)]' : 'text-[var(--fg-4)] group-hover:text-[var(--fg-3)]',
        )}
      />
      <span className="flex-1 truncate font-medium">{label}</span>
      <span className="mono text-[10.5px] tabular-nums text-[var(--fg-5)]">{count}</span>
      <ChevronDown
        className={cn(
          'h-3.5 w-3.5 shrink-0 text-[var(--fg-5)] transition-transform duration-300',
          !expanded && '-rotate-90',
        )}
      />
    </button>
  );
}

function SubcategoryRow({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'true' : undefined}
      className={cn(
        'flex w-full items-center gap-2 rounded-[6px] px-2.5 py-[5px] text-left text-[12.5px] transition-colors',
        active
          ? 'bg-[color-mix(in_srgb,var(--c)_12%,transparent)] text-[var(--fg)]'
          : 'text-[var(--fg-4)] hover:bg-[var(--surface)] hover:text-[var(--fg-2)]',
      )}
    >
      {Icon ? (
        <Icon className={cn('h-3 w-3 shrink-0', active ? 'text-[var(--c)]' : 'text-[var(--fg-5)]')} />
      ) : (
        <span
          className={cn('h-1.5 w-1.5 shrink-0 rounded-full', active ? 'bg-[var(--c)]' : 'bg-[var(--fg-5)]')}
          style={active ? { boxShadow: '0 0 8px var(--c)' } : undefined}
        />
      )}
      <span className="truncate">{label}</span>
    </button>
  );
}

function Collapse({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    <AnimatePresence initial={false}>
      {open && (
        <m.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
          className="overflow-hidden"
        >
          <div className="mb-1.5 ml-[15px] mt-0.5 space-y-0.5 border-l border-[var(--line)] pl-2">{children}</div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
