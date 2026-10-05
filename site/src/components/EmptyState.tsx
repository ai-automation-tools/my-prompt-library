import { m } from 'motion/react';
import { Copy, Library, LogIn, Plus, Sparkles, UserPlus } from 'lucide-react';
import { Button } from './ui/primitives';

interface EmptyStateProps {
  type: 'not-authenticated' | 'no-prompts';
  onLogin?: () => void;
  onSignup?: () => void;
  onBrowsePublic?: () => void;
}

function Orb({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mb-7">
      <div className="absolute inset-0 rounded-full bg-[var(--glow-soft)] blur-2xl" />
      <div className="relative grid h-24 w-24 place-items-center rounded-full border border-[var(--line-2)] bg-[var(--surface)]">
        <div className="absolute inset-[-6px] rounded-full border border-dashed border-[var(--line-2)] opacity-70 [animation:spin_40s_linear_infinite]" />
        {children}
      </div>
    </div>
  );
}

export default function EmptyState({ type, onLogin, onSignup, onBrowsePublic }: EmptyStateProps) {
  if (type === 'not-authenticated') {
    return (
      <m.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
        className="mx-auto flex max-w-xl flex-col items-center justify-center py-16 text-center"
      >
        <Orb>
          <Library className="h-9 w-9 text-[var(--accent)]" />
        </Orb>
        <p className="eyebrow mb-2">My Library</p>
        <h2 className="text-2xl font-semibold tracking-tight text-[var(--fg)]">Sign in to build your library</h2>
        <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-[var(--fg-3)]">
          Save prompts from the public library, write your own, and keep them in one place — synced to your account.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
          <Button variant="primary" onClick={onSignup} icon={<UserPlus className="h-4 w-4" />}>
            Create account
          </Button>
          <Button variant="outline" onClick={onLogin} icon={<LogIn className="h-4 w-4" />}>
            Log in
          </Button>
        </div>
        <button
          type="button"
          onClick={onBrowsePublic}
          className="mt-5 inline-flex items-center gap-1.5 text-[13px] text-[var(--fg-4)] transition-colors hover:text-[var(--accent)]"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Browse the public library instead
        </button>
      </m.div>
    );
  }

  return (
    <m.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
      className="mx-auto flex max-w-xl flex-col items-center justify-center py-16 text-center"
    >
      <Orb>
        <Library className="h-9 w-9 text-[var(--fg-3)]" />
        <span className="absolute -right-1 -top-1 grid h-8 w-8 place-items-center rounded-full bg-[var(--accent)] text-[var(--accent-ink)] shadow-[0_6px_20px_var(--glow)]">
          <Plus className="h-4 w-4" />
        </span>
      </Orb>
      <p className="eyebrow mb-2">My Library</p>
      <h2 className="text-2xl font-semibold tracking-tight text-[var(--fg)]">Your library is empty</h2>
      <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-[var(--fg-3)]">
        Two ways to fill it. Both take a click.
      </p>

      <div className="mt-7 grid w-full gap-2 sm:grid-cols-2">
        {[
          {
            icon: Copy,
            title: 'Save from the public library',
            body: 'Open any prompt and choose “Save to My Library”, or use the save button on a card.',
          },
          {
            icon: Plus,
            title: 'Write your own',
            body: 'Use “New prompt” in the top bar. Markdown, tags and categories are all supported.',
          },
        ].map(({ icon: Icon, title, body }) => (
          <div key={title} className="surface flex items-start gap-3 p-4 text-left">
            <span className="glyph h-8 w-8 rounded-[8px]" style={{ ['--c' as string]: 'var(--accent)' }}>
              <Icon className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-[14px] font-semibold text-[var(--fg)]">{title}</h3>
              <p className="mt-1 text-[13px] leading-relaxed text-[var(--fg-3)]">{body}</p>
            </div>
          </div>
        ))}
      </div>

      <Button variant="primary" onClick={onBrowsePublic} icon={<Sparkles className="h-4 w-4" />} className="mt-7">
        Browse the public library
      </Button>
    </m.div>
  );
}
