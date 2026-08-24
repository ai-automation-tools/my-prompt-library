/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sparkles } from 'lucide-react';
import PromptCard, { type Prompt } from './PromptCard';
import EmptyState from './EmptyState';

/**
 * The card-level props every prompt grid drills down to `PromptCard`. Bundled so
 * the three grids in the app (featured, all-prompts, subcategory) pass one object
 * instead of eleven props each.
 */
export interface PromptCardActions {
  libraryMode: 'public' | 'my';
  copyingToMyPromptsId: string | null;
  favorites: string[];
  copied: string | null;
  onPromptClick: (prompt: Prompt) => void;
  onCopyToMyPrompts: (prompt: Prompt) => void;
  onToggleFavorite: (promptId: string, e?: React.MouseEvent) => void;
  onEditPrompt: (prompt: Prompt) => void;
  onDeletePrompt: (promptId: string) => void;
  onDownloadMarkdown: (prompt: Prompt) => void;
  onCopy: (content: string, promptId: string) => void;
}

interface PromptCardGridProps {
  prompts: Prompt[];
  actions: PromptCardActions;
  /** Featured uses a 4-up grid at `lg`; the main lists step 3 → 4. */
  columns?: 'featured' | 'default';
}

/** Responsive grid of `PromptCard`s — the markup shared by all three lists. */
export function PromptCardGrid({ prompts, actions, columns = 'default' }: PromptCardGridProps) {
  return (
    <div
      className={
        columns === 'featured'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'
          : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
      }
    >
      {prompts.map((prompt, i) => (
        <PromptCard
          key={prompt.id}
          prompt={prompt}
          index={i}
          libraryMode={actions.libraryMode}
          copyingToMyPromptsId={actions.copyingToMyPromptsId}
          favorites={actions.favorites}
          copied={actions.copied}
          onPromptClick={actions.onPromptClick}
          onCopyToMyPrompts={actions.onCopyToMyPrompts}
          onToggleFavorite={actions.onToggleFavorite}
          onEditPrompt={actions.onEditPrompt}
          onDeletePrompt={actions.onDeletePrompt}
          onDownloadMarkdown={actions.onDownloadMarkdown}
          onCopy={actions.onCopy}
        />
      ))}
    </div>
  );
}

/** Six pulsing card skeletons shown while the prompt list is in flight. */
function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="glass-card rounded-[var(--radius-lg)] p-6 animate-pulse">
          <div className="h-4 bg-[var(--glass-bg)] rounded w-3/4 mb-4"></div>
          <div className="h-3 bg-[var(--glass-bg)] rounded w-1/2 mb-6"></div>
          <div className="space-y-2">
            <div className="h-2 bg-[var(--glass-bg)] rounded"></div>
            <div className="h-2 bg-[var(--glass-bg)] rounded w-5/6"></div>
            <div className="h-2 bg-[var(--glass-bg)] rounded w-4/6"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function NoResults({ searchQuery }: { searchQuery: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Sparkles className="w-16 h-16 text-[var(--text-tertiary)] mb-4" />
      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No prompts found</h3>
      <p className="text-[var(--text-tertiary)] mb-6 max-w-md">
        {searchQuery
          ? `No prompts match "${searchQuery}". Try a different search term.`
          : 'Get started by creating your first prompt!'}
      </p>
    </div>
  );
}

interface PromptGridProps {
  isLoading: boolean;
  /** The current page's prompts. */
  prompts: Prompt[];
  /** Total matching the current filters, across all pages. */
  totalCount: number;
  currentPage: number;
  totalPages: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  searchQuery: string;
  isAuthenticated: boolean;
  onLogin: () => void;
  onSignup: () => void;
  onBrowsePublic: () => void;
  actions: PromptCardActions;
}

/**
 * The main prompt list: loading skeletons, the empty states, the paginated card
 * grid, and its pagination controls. Purely presentational — search, sort and
 * page state all live in `usePromptFilters`.
 */
export default function PromptGrid({
  isLoading,
  prompts,
  totalCount,
  currentPage,
  totalPages,
  onPreviousPage,
  onNextPage,
  searchQuery,
  isAuthenticated,
  onLogin,
  onSignup,
  onBrowsePublic,
  actions,
}: PromptGridProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (totalCount === 0) {
    if (actions.libraryMode === 'my') {
      return isAuthenticated ? (
        <EmptyState type="no-prompts" onBrowsePublic={onBrowsePublic} />
      ) : (
        <EmptyState
          type="not-authenticated"
          onLogin={onLogin}
          onSignup={onSignup}
          onBrowsePublic={onBrowsePublic}
        />
      );
    }
    return <NoResults searchQuery={searchQuery} />;
  }

  return (
    <>
      <PromptCardGrid prompts={prompts} actions={actions} />

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-6 mt-8">
          <button
            onClick={onPreviousPage}
            disabled={currentPage === 1}
            className="px-6 py-3 rounded-[var(--radius-md)] bg-[var(--accent)] border-2 border-[var(--accent)] text-white font-bold shadow-lg hover:shadow-[0_0_24px_var(--accent-glow)] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none hover:scale-105 transition-all duration-200"
          >
            ← Previous
          </button>
          <span className="text-sm font-medium text-[var(--text-secondary)] px-4">
            Page {currentPage} of {totalPages}{' '}
            <span className="text-[var(--text-tertiary)]">({totalCount} total)</span>
          </span>
          <button
            onClick={onNextPage}
            disabled={currentPage === totalPages}
            className="px-6 py-3 rounded-[var(--radius-md)] bg-[var(--accent)] border-2 border-[var(--accent)] text-white font-bold shadow-lg hover:shadow-[0_0_24px_var(--accent-glow)] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none hover:scale-105 transition-all duration-200"
          >
            Next →
          </button>
        </div>
      )}
    </>
  );
}
