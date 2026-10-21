import { type ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '../lib/cn';

export interface Crumb {
  label: ReactNode;
  onClick?: () => void;
}

/** library › section › category › subcategory › prompt, shown above the content once you are inside a category. */
export default function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  if (crumbs.length < 3) return null;
  return (
    <nav aria-label="Breadcrumb" className="pt-5">
      <ol className="flex min-w-0 flex-wrap items-center gap-1 text-[13px]">
        {crumbs.map((crumb, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={i} className={cn('flex items-center gap-1', last ? 'min-w-0' : 'shrink-0')}>
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[var(--fg-5)]" aria-hidden="true" />}
              {crumb.onClick && !last ? (
                <button
                  type="button"
                  onClick={crumb.onClick}
                  className="max-w-[14rem] truncate rounded px-1 py-0.5 text-[var(--fg-4)] transition-colors hover:bg-[var(--hover-bg)] hover:text-[var(--fg)]"
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
  );
}
