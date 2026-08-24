/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Menu } from 'lucide-react';
import ResourcesNav from './ResourcesNav';

export interface TopBarUser {
  email: string;
  name: string | null;
}

interface TopBarProps {
  user: TopBarUser | null;
  onOpenSidebar: () => void;
  onLogin: () => void;
  onSignup: () => void;
  onLogout: () => void;
}

/**
 * Page chrome above the content area: the mobile sidebar trigger, the
 * data-driven external-resources menus, and the auth controls.
 */
export default function TopBar({ user, onOpenSidebar, onLogin, onSignup, onLogout }: TopBarProps) {
  return (
    <div className="shrink-0 px-4 md:px-6 py-3 border-b border-[var(--glass-border)]">
      <div className="flex items-center gap-4">
        {/* LEFT: Mobile menu */}
        <button
          onClick={onOpenSidebar}
          className="p-2 rounded-[var(--radius-sm)] hover:bg-[var(--glass-bg-hover)] transition-colors md:hidden"
        >
          <Menu className="w-5 h-5 text-[var(--text-secondary)]" />
        </button>

        {/* CENTER: Navigation Dropdowns (Desktop Only) */}
        <ResourcesNav />

        {/* RIGHT: Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center rounded-lg glass-subtle border border-[var(--glass-border)] overflow-hidden">
              <div className="px-4 py-1.5 border-r border-[var(--glass-border)]">
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  {user.name || user.email}
                </p>
              </div>
              <button
                onClick={onLogout}
                className="px-4 py-1.5 bg-red-900/20 hover:bg-red-800/30 text-sm font-medium text-red-300 hover:text-red-200 transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onLogin}
                className="px-4 py-1.5 rounded-lg glass-subtle border border-[var(--glass-border)] hover:border-[var(--accent)] text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all"
              >
                Login
              </button>
              <button
                onClick={onSignup}
                className="px-4 py-1.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-secondary)] text-white text-sm font-semibold transition-colors shadow-[0_2px_12px_var(--accent-glow)]"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
