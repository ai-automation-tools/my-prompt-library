/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search } from 'lucide-react';

interface LibraryHeroProps {
  title: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

/**
 * Section heading + library search field shown at the top of the content area
 * whenever no single prompt or subcategory is selected.
 */
export default function LibraryHero({ title, searchQuery, onSearchChange }: LibraryHeroProps) {
  return (
    <div className="py-8 md:py-12 mb-8">
      <div className="max-w-4xl">
        <h1 className="heading-display text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
          {title}
        </h1>

        {/* Search Bar */}
        <div className="relative max-w-2xl">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <Search className="w-5 h-5 text-[var(--text-tertiary)]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search prompts by title, content, tags, or category..."
            className="w-full pl-12 pr-4 py-3.5 rounded-[var(--radius-lg)] bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-glow-subtle)] transition-all duration-300"
          />
        </div>
      </div>
    </div>
  );
}
