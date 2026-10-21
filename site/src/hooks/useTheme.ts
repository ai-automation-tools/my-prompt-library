import { useEffect, useState } from 'react';

/**
 * Light | Dark, the house-style theme switch. `html.light` / `html.dark` carry
 * the token set; index.html applies the stored one before first paint under
 * the same key, so THEME_DEFAULT here must match the default there.
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
