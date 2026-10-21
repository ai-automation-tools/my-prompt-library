import { useEffect, useState } from 'react';

/**
 * Appearance: a Light | Dark mode (the house-style switch) and a colour
 * palette that swaps the accent on top of it. `html.light` / `html.dark` carry
 * the mode's token set and `html[data-palette]` the accent; index.html applies
 * both before first paint under the same keys, so the defaults here must match
 * the defaults there.
 */
export type Theme = 'light' | 'dark';

export const THEME_KEY = 'my-prompt-library.theme';
export const THEME_DEFAULT: Theme = 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.classList.contains('light') ? 'light' : THEME_DEFAULT,
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'light' ? '#fafafa' : '#060606');
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* storage unavailable */
    }
  }, [theme]);

  return [theme, setTheme] as const;
}

/* ----- Colour palette ----- */

export type Palette = 'sky' | 'violet' | 'emerald' | 'ember';

export interface PaletteMeta {
  id: Palette;
  name: string;
  /** What it echoes from the old theme list, for the picker's caption. */
  note: string;
  /** Swatch colours, dark and light, so the picker paints before a palette applies. */
  dark: string;
  light: string;
}

/** Ids match the `html[data-palette]` blocks in index.css. */
export const PALETTES: readonly PaletteMeta[] = [
  { id: 'sky', name: 'Sky', note: 'The org default', dark: '#38bdf8', light: '#0369a1' },
  { id: 'violet', name: 'Violet', note: 'From Midnight Violet', dark: '#a78bfa', light: '#6d28d9' },
  { id: 'emerald', name: 'Emerald', note: 'From Emerald Glass', dark: '#34d399', light: '#047857' },
  { id: 'ember', name: 'Ember', note: 'From Carbon Ember', dark: '#fb923c', light: '#c2410c' },
];

export const PALETTE_KEY = 'my-prompt-library.palette';
export const PALETTE_DEFAULT: Palette = 'sky';

export function isPalette(value: string | null | undefined): value is Palette {
  return PALETTES.some(p => p.id === value);
}

export function usePalette() {
  const [palette, setPalette] = useState<Palette>(() => {
    const current = document.documentElement.getAttribute('data-palette');
    return isPalette(current) ? current : PALETTE_DEFAULT;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (palette === PALETTE_DEFAULT) root.removeAttribute('data-palette');
    else root.setAttribute('data-palette', palette);
    try {
      localStorage.setItem(PALETTE_KEY, palette);
    } catch {
      /* storage unavailable */
    }
  }, [palette]);

  return [palette, setPalette] as const;
}
