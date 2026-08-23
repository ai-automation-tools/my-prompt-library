/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, FileText, Star, Tag } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { type Prompt } from './PromptCard';
import { type SortOption } from '../hooks/usePromptFilters';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type OpenDropdown = 'favorites' | 'recent' | 'tags' | null;

/** Shared shell for the three pill-shaped filter dropdowns. */
function FilterDropdown({
  icon,
  label,
  count,
  isOpen,
  onToggle,
  panelClassName,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  count?: number;
  isOpen: boolean;
  onToggle: () => void;
  panelClassName: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative filter-dropdown">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-subtle border border-[var(--glass-border)] hover:border-[var(--accent)] transition-colors text-xs"
      >
        {icon}
        <span className="font-semibold text-[var(--text-secondary)]">{label}</span>
        {count !== undefined && <span className="font-bold text-[var(--accent)]">({count})</span>}
        {isOpen ? (
          <ChevronDown className="w-3 h-3 text-[var(--text-tertiary)]" />
        ) : (
          <ChevronRight className="w-3 h-3 text-[var(--text-tertiary)]" />
        )}
      </button>
      {isOpen && <div className={panelClassName}>{children}</div>}
    </div>
  );
}

/** The title/category rows inside the favorites and recently-viewed panels. */
function PromptPickerList({
  prompts,
  onSelect,
}: {
  prompts: Prompt[];
  onSelect: (prompt: Prompt) => void;
}) {
  return (
    <div className="space-y-1 max-h-80 overflow-y-auto custom-scrollbar">
      {prompts.map(prompt => (
        <button
          key={prompt.id}
          onClick={() => onSelect(prompt)}
          className="w-full text-left px-3 py-2 rounded-md hover:bg-[var(--glass-bg-hover)] transition-colors group"
        >
          <p className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] truncate">
            {prompt.title}
          </p>
          <p className="text-xs text-[var(--text-tertiary)] truncate mt-0.5">
            {prompt.category?.replace(/_/g, ' ')}
          </p>
        </button>
      ))}
    </div>
  );
}

interface PromptListToolbarProps {
  title: string;
  /** Prompts matching the current filters, across all pages. */
  totalCount: number;
  /** Every prompt in the active section, before filtering. */
  sectionCount: number;
  categoryCount: number;
  favoritePrompts: Prompt[];
  recentlyViewedPrompts: Prompt[];
  onPromptSelect: (prompt: Prompt) => void;
  allTags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onClearTags: () => void;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
}

/**
 * The header row above the prompt list: section title and counts, the total /
 * categories stat badges, the favorites / recent / tag filter dropdowns, and the
 * sort `<select>`. Owns only which dropdown is open; every filter value it edits
 * lives in `usePromptFilters`.
 */
export default function PromptListToolbar({
  title,
  totalCount,
  sectionCount,
  categoryCount,
  favoritePrompts,
  recentlyViewedPrompts,
  onPromptSelect,
  allTags,
  selectedTags,
  onTagToggle,
  onClearTags,
  sortOption,
  onSortChange,
}: PromptListToolbarProps) {
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);

  // Close the open dropdown on any click outside the pills.
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.filter-dropdown')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggle = (name: Exclude<OpenDropdown, null>) =>
    setOpenDropdown(prev => (prev === name ? null : name));

  const hasFilters =
    favoritePrompts.length > 0 || recentlyViewedPrompts.length > 0 || allTags.length > 0;

  return (
    <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div className="flex items-center gap-3 flex-wrap">
        <div>
          <h2 className="heading-display text-xl font-bold tracking-tight text-[var(--text-primary)]">
            {title}
          </h2>
          <p className="label mt-2">{totalCount} prompts</p>
        </div>

        {/* Stat badges */}
        <div className="flex items-center gap-2">
          <div className="glass rounded-[var(--radius-sm)] px-3 py-1.5 text-center">
            <span className="text-sm font-bold text-[var(--accent)]">{sectionCount}</span>
            <span className="text-xs text-[var(--text-tertiary)] ml-1">Total</span>
          </div>
          <div className="glass rounded-[var(--radius-sm)] px-3 py-1.5 text-center">
            <span className="text-sm font-bold text-[var(--text-primary)]">{categoryCount}</span>
            <span className="text-xs text-[var(--text-tertiary)] ml-1">Categories</span>
          </div>
        </div>

        {/* Filter Buttons */}
        {hasFilters && (
          <div className="flex flex-wrap gap-2">
            {favoritePrompts.length > 0 && (
              <FilterDropdown
                icon={<Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />}
                label="Favorites"
                count={favoritePrompts.length}
                isOpen={openDropdown === 'favorites'}
                onToggle={() => toggle('favorites')}
                panelClassName="absolute top-full left-0 mt-2 z-50 w-72 dropdown-solid rounded-[var(--radius-md)] p-3 shadow-xl border border-[var(--glass-border)]"
              >
                <PromptPickerList
                  prompts={favoritePrompts}
                  onSelect={prompt => {
                    onPromptSelect(prompt);
                    setOpenDropdown(null);
                  }}
                />
              </FilterDropdown>
            )}

            {recentlyViewedPrompts.length > 0 && (
              <FilterDropdown
                icon={<FileText className="w-3 h-3 text-[var(--text-tertiary)]" />}
                label="Recent"
                count={recentlyViewedPrompts.length}
                isOpen={openDropdown === 'recent'}
                onToggle={() => toggle('recent')}
                panelClassName="absolute top-full left-0 mt-2 z-50 w-72 dropdown-solid rounded-[var(--radius-md)] p-3 shadow-xl border border-[var(--glass-border)]"
              >
                <PromptPickerList
                  prompts={recentlyViewedPrompts}
                  onSelect={prompt => {
                    onPromptSelect(prompt);
                    setOpenDropdown(null);
                  }}
                />
              </FilterDropdown>
            )}

            {allTags.length > 0 && (
              <FilterDropdown
                icon={<Tag className="w-3 h-3 text-[var(--text-tertiary)]" />}
                label="Tags"
                count={selectedTags.length > 0 ? selectedTags.length : undefined}
                isOpen={openDropdown === 'tags'}
                onToggle={() => toggle('tags')}
                panelClassName="absolute top-full left-0 mt-2 z-50 w-96 dropdown-solid rounded-[var(--radius-md)] p-4 shadow-xl border border-[var(--glass-border)]"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase">
                    Select Tags
                  </span>
                  {selectedTags.length > 0 && (
                    <button
                      onClick={onClearTags}
                      className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 max-h-80 overflow-y-auto custom-scrollbar">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => onTagToggle(tag)}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-colors',
                        selectedTags.includes(tag)
                          ? 'bg-[var(--accent)] text-white shadow-[0_2px_12px_var(--accent-glow)]'
                          : 'bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-tertiary)] hover:bg-[var(--glass-bg-hover)] hover:text-[var(--text-primary)]'
                      )}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </FilterDropdown>
            )}
          </div>
        )}
      </div>

      <div className="relative">
        <select
          value={sortOption}
          onChange={e => onSortChange(e.target.value as SortOption)}
          className="py-2 pl-3 pr-8 rounded-[var(--radius-sm)] bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[0.75rem] font-medium tracking-wider uppercase text-[var(--text-secondary)] cursor-pointer appearance-none transition-all duration-300 hover:border-[var(--accent)] focus:outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-glow-subtle)]"
        >
          <option value="title-asc">Title (A-Z)</option>
          <option value="title-desc">Title (Z-A)</option>
          <option value="modified-desc">Newest</option>
          <option value="modified-asc">Oldest</option>
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] pointer-events-none" />
      </div>
    </div>
  );
}
