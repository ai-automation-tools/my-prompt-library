/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search, X } from 'lucide-react';
import { m } from 'motion/react';
import type { SectionMeta } from '../lib/sections';
import CountUp from './ui/CountUp';

interface LibraryHeroProps {
  section: SectionMeta;
  libraryMode: 'public' | 'my';
  /** Up to three counters; they animate when their values change. */
  stats: { label: string; value: number }[];
  searchQuery: string;
  /** Omit to hide the search field (Skill Packs has nothing to filter). */
  onSearchChange?: (value: string) => void;
}

/**
 * Section heading, blurb, live counters and the in-section search field —
 * shown at the top of the content area whenever no prompt or subcategory is
 * open. The counters animate up when the section (and so the numbers) change.
 */
export default function LibraryHero({ section, libraryMode, stats, searchQuery, onSearchChange }: LibraryHeroProps) {
  const Icon = section.icon;

  return (
    <section className="relative pb-6 pt-8 md:pt-10" aria-labelledby="section-title">
      <m.div
        key={section.id + libraryMode}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
        className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
      >
        <div className="min-w-0 max-w-2xl">
          <p className="eyebrow mb-3 flex items-center gap-2">
            <span className="live-dot" />
            {libraryMode === 'my' ? 'My Library' : 'Public Library'}
          </p>
          <h1
            id="section-title"
            className="flex items-center gap-3 text-[2rem] font-semibold leading-none tracking-[-0.03em] text-[var(--fg)] md:text-[2.6rem]"
          >
            <span className="glyph h-11 w-11 rounded-[11px] md:h-12 md:w-12">
              <Icon className="h-5 w-5 md:h-6 md:w-6" />
            </span>
            <span className="gradient-text pb-1">{section.label}</span>
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-[var(--fg-3)]">
            {libraryMode === 'my'
              ? `Your saved and authored ${section.label.toLowerCase()}. Only you can see these.`
              : section.description}
          </p>
        </div>

        <dl className="grid shrink-0 grid-cols-3 gap-px overflow-hidden rounded-[var(--r-lg)] border border-[var(--line)] bg-[var(--line)]">
          {stats.map(({ label, value }) => (
            <div key={label} className="bg-[var(--surface)] px-4 py-3 backdrop-blur-md md:px-5">
              <dt className="eyebrow text-[10px]">{label}</dt>
              <dd className="mt-1 text-xl font-semibold tracking-tight text-[var(--fg)] md:text-2xl">
                <CountUp value={value} />
              </dd>
            </div>
          ))}
        </dl>
      </m.div>

      {/* Search. Matches title, tags, category and subcategory — the listing
          carries no body text, so the placeholder promises no more than that. */}
      {onSearchChange && (
      <div className="relative mt-7 max-w-2xl">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fg-4)]" />
        <input
          type="search"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          placeholder={`Filter ${section.label.toLowerCase()} by title, tag or category…`}
          aria-label={`Filter ${section.label}`}
          className="input h-11 rounded-[var(--r-lg)] pl-11 pr-11 text-[14.5px] [&::-webkit-search-cancel-button]:hidden"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
            className="icon-btn absolute right-1.5 top-1/2 h-8 w-8 -translate-y-1/2"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      )}
    </section>
  );
}
