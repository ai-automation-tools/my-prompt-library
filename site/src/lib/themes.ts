/**
 * The theme picker's list. Ids match the `[data-theme]` blocks in themes.css;
 * `bg` and `accent` are the swatch colours the picker paints — they mirror the
 * tokens but are duplicated here so the swatches render before a theme applies.
 */

export type Theme =
  | 'mikesailab'
  | 'light'
  | 'retro-wave'
  | 'emerald-glass'
  | 'obsidian-cyan'
  | 'carbon-ember'
  | 'midnight-violet'
  | 'solar-flare'
  | 'sahara-gold'
  | 'void-black'
  | 'frosted-steel'
  | 'terminal-hacker'
  | 'github-dark-pro'
  | 'react-modern'
  | 'dark-pro'
  | 'nordic-night';

export interface ThemeMeta {
  id: Theme;
  name: string;
  bg: string;
  accent: string;
}

export const THEMES: readonly ThemeMeta[] = [
  { id: 'mikesailab', name: "Mike's AI Lab", bg: '#060606', accent: '#38bdf8' },
  { id: 'void-black', name: 'Void Black', bg: '#050505', accent: '#d4d4d4' },
  { id: 'github-dark-pro', name: 'GitHub Dark', bg: '#0d1117', accent: '#2f81f7' },
  { id: 'frosted-steel', name: 'Frosted Steel', bg: '#0e1218', accent: '#94a3b8' },
  { id: 'obsidian-cyan', name: 'Obsidian Cyan', bg: '#05162a', accent: '#00e5ff' },
  { id: 'midnight-violet', name: 'Midnight Violet', bg: '#140a30', accent: '#c084fc' },
  { id: 'emerald-glass', name: 'Emerald Glass', bg: '#01201a', accent: '#10b981' },
  { id: 'carbon-ember', name: 'Carbon Ember', bg: '#1c1208', accent: '#ff6b2c' },
  { id: 'solar-flare', name: 'Solar Flare', bg: '#220810', accent: '#ff2d55' },
  { id: 'sahara-gold', name: 'Sahara Gold', bg: '#221a0a', accent: '#ffb800' },
  { id: 'retro-wave', name: 'Retro Wave', bg: '#0a0118', accent: '#ff00ff' },
  { id: 'terminal-hacker', name: 'Terminal', bg: '#020804', accent: '#39ff14' },
  { id: 'react-modern', name: 'React Modern', bg: '#1a1f2e', accent: '#61dafb' },
  { id: 'dark-pro', name: 'Dark Pro', bg: '#0f1419', accent: '#9d4edd' },
  { id: 'nordic-night', name: 'Nordic Night', bg: '#1e2430', accent: '#88c0d0' },
  { id: 'light', name: 'Light', bg: '#f5f5f7', accent: '#6366f1' },
];

export const THEME_STORAGE_KEY = 'prompt-library-theme';

export function isTheme(value: string | null | undefined): value is Theme {
  return THEMES.some(t => t.id === value);
}

export function readStoredTheme(): Theme {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (isTheme(saved)) return saved;
  } catch {
    /* storage unavailable */
  }
  return 'mikesailab';
}
