/**
 * The theme switcher at the foot of the sidebar: a trigger showing the current
 * swatch, and a popover grid of every theme. Closes on outside click or Escape.
 */

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronsUpDown, Palette } from 'lucide-react';
import { AnimatePresence, m } from 'motion/react';
import { cn } from '../lib/cn';
import { THEMES, type Theme } from '../lib/themes';

interface ThemePickerProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

function Swatch({ bg, accent, size = 18 }: { bg: string; accent: string; size?: number }) {
  return (
    <span
      className="relative inline-block shrink-0 overflow-hidden rounded-[5px] border border-white/10"
      style={{ width: size, height: size, background: bg }}
      aria-hidden="true"
    >
      <span
        className="absolute rounded-full"
        style={{
          width: size * 0.42,
          height: size * 0.42,
          right: size * 0.16,
          bottom: size * 0.16,
          background: accent,
          boxShadow: `0 0 8px ${accent}`,
        }}
      />
    </span>
  );
}

export default function ThemePicker({ theme, setTheme }: ThemePickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = THEMES.find(t => t.id === theme) ?? THEMES[0];

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          'flex w-full items-center gap-2.5 rounded-[var(--r-md)] border border-transparent px-2.5 py-2 text-left transition-colors',
          'hover:border-[var(--line)] hover:bg-[var(--surface)]',
          open && 'border-[var(--line)] bg-[var(--surface)]',
        )}
      >
        <Swatch bg={current.bg} accent={current.accent} />
        <span className="min-w-0 flex-1">
          <span className="eyebrow block text-[10px]">Theme</span>
          <span className="block truncate text-[13px] font-medium text-[var(--fg-2)]">{current.name}</span>
        </span>
        <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-[var(--fg-4)]" />
      </button>

      <AnimatePresence>
        {open && (
          <m.div
            role="listbox"
            aria-label="Theme"
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.2, 0.7, 0.2, 1] }}
            className="popover absolute bottom-full left-0 right-0 z-50 mb-2 p-2"
          >
            <div className="mb-1.5 flex items-center gap-2 px-2 pt-1">
              <Palette className="h-3.5 w-3.5 text-[var(--fg-4)]" />
              <span className="eyebrow">Appearance</span>
            </div>
            <div className="max-h-[340px] space-y-0.5 overflow-y-auto pr-0.5">
              {THEMES.map(t => {
                const active = t.id === theme;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      setTheme(t.id);
                      setOpen(false);
                    }}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-[var(--r-md)] border px-2 py-1.5 text-left text-[13px] transition-colors',
                      active
                        ? 'border-[color-mix(in_srgb,var(--accent)_40%,transparent)] bg-[var(--tint)] text-[var(--fg)]'
                        : 'border-transparent text-[var(--fg-3)] hover:bg-[var(--surface-2)] hover:text-[var(--fg)]',
                    )}
                  >
                    <Swatch bg={t.bg} accent={t.accent} size={16} />
                    <span className="min-w-0 flex-1 truncate">{t.name}</span>
                    {active && <Check className="h-3.5 w-3.5 shrink-0 text-[var(--accent)]" />}
                  </button>
                );
              })}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
