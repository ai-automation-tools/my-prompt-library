import { Moon, Sun } from 'lucide-react';
import type { Theme } from '../hooks/useTheme';

/** The Light | Dark segmented pill: last control at the right end of the top bar. */
export default function ThemeSwitch({ theme, setTheme }: { theme: Theme; setTheme: (t: Theme) => void }) {
  return (
    <div className="theme-sw" role="group" aria-label="Theme">
      {(
        [
          { id: 'light', label: 'Light theme', icon: Sun },
          { id: 'dark', label: 'Dark theme', icon: Moon },
        ] as const
      ).map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          aria-pressed={theme === id}
          aria-label={label}
          title={label}
          onClick={() => setTheme(id)}
        >
          <Icon aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
