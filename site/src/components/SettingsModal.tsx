/**
 * Settings: appearance (mode + colour palette), the local data this browser
 * keeps, and the keyboard shortcuts. Mounted only while open.
 */

import { Check, Moon, Sun, Trash2 } from 'lucide-react';
import { cn } from '../lib/cn';
import { PALETTES, type Palette, type Theme } from '../hooks/useTheme';
import { Button, Kbd, MOD_KEY, Modal, ModalHeader } from './ui/primitives';

interface SettingsModalProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  palette: Palette;
  setPalette: (palette: Palette) => void;
  favoriteCount: number;
  recentCount: number;
  onClearLocalData: () => void;
  onClose: () => void;
}

const SHORTCUTS: { keys: string[]; does: string }[] = [
  { keys: [MOD_KEY, 'K'], does: 'Search prompts, sections and actions' },
  { keys: ['Esc'], does: 'Close a dialog or menu' },
  { keys: ['↑', '↓', '↵'], does: 'Move through and open palette results' },
];

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-[var(--line)] px-6 py-5 first:border-t-0">
      <h3 className="eyebrow">{title}</h3>
      {hint && <p className="mt-1 text-[13px] text-[var(--fg-3)]">{hint}</p>}
      <div className="mt-3.5">{children}</div>
    </section>
  );
}

export default function SettingsModal({
  theme,
  setTheme,
  palette,
  setPalette,
  favoriteCount,
  recentCount,
  onClearLocalData,
  onClose,
}: SettingsModalProps) {
  const localCount = favoriteCount + recentCount;

  return (
    <Modal onClose={onClose} labelledBy="settings-title">
      <ModalHeader id="settings-title" title="Settings" description="Remembered in this browser only." onClose={onClose} />

      <div className="max-h-[70vh] overflow-y-auto">
        <Section title="Appearance" hint="Dark is the default; the palette swaps the accent on top of it.">
          <div className="flex flex-col gap-4">
            <div className="segmented w-full sm:w-72" role="group" aria-label="Mode">
              {(
                [
                  { id: 'light', label: 'Light', icon: Sun },
                  { id: 'dark', label: 'Dark', icon: Moon },
                ] as const
              ).map(({ id, label, icon: Icon }) => (
                <button key={id} type="button" aria-pressed={theme === id} onClick={() => setTheme(id)}>
                  {theme === id && <span className="segmented-thumb" />}
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {label}
                </button>
              ))}
            </div>

            <div role="radiogroup" aria-label="Colour" className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {PALETTES.map(p => {
                const active = p.id === palette;
                const swatch = theme === 'light' ? p.light : p.dark;
                return (
                  <button
                    key={p.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setPalette(p.id)}
                    className={cn(
                      'flex items-center gap-2.5 rounded-[var(--r-md)] border p-2.5 text-left transition-colors',
                      active
                        ? 'border-[color-mix(in_srgb,var(--accent)_45%,var(--line-2))] bg-[var(--tint)]'
                        : 'border-[var(--line)] bg-[var(--surface)] hover:border-[var(--line-hover)] hover:bg-[var(--surface-2)]',
                    )}
                  >
                    <span
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-full"
                      style={{ background: swatch, color: theme === 'light' ? '#fff' : '#09090b' }}
                      aria-hidden="true"
                    >
                      {active && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[13px] font-medium text-[var(--fg)]">{p.name}</span>
                      <span className="block truncate text-[11px] text-[var(--fg-4)]">{p.note}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </Section>

        <Section title="Local data" hint="Favourites and recently viewed prompts are stored in this browser, not in My Library.">
          <div className="flex flex-wrap items-center gap-3">
            <p className="mono text-[12px] text-[var(--fg-4)]">
              {favoriteCount} {favoriteCount === 1 ? 'favourite' : 'favourites'} · {recentCount} recent
            </p>
            <Button
              size="sm"
              variant="danger"
              className="ml-auto"
              disabled={localCount === 0}
              onClick={onClearLocalData}
              icon={<Trash2 className="h-3.5 w-3.5" />}
            >
              Clear
            </Button>
          </div>
        </Section>

        <Section title="Keyboard">
          <dl className="space-y-2">
            {SHORTCUTS.map(s => (
              <div key={s.does} className="flex items-center gap-3 text-[13px]">
                <dt className="flex w-24 shrink-0 items-center gap-1">
                  {s.keys.map(k => (
                    <Kbd key={k}>{k}</Kbd>
                  ))}
                </dt>
                <dd className="text-[var(--fg-3)]">{s.does}</dd>
              </div>
            ))}
          </dl>
        </Section>
      </div>
    </Modal>
  );
}
