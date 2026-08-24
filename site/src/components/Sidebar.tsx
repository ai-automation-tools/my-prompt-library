/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  BookOpen,
  Library,
  Package,
  FolderOpen,
  ChevronDown,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Prompt } from './PromptCard';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Theme = 'mikesailab' | 'light' | 'retro-wave' | 'emerald-glass' | 'obsidian-cyan' | 'carbon-ember' | 'midnight-violet' | 'solar-flare' | 'sahara-gold' | 'void-black' | 'frosted-steel' | 'terminal-hacker' | 'github-dark-pro' | 'react-modern' | 'dark-pro' | 'nordic-night';

export const THEMES: { id: Theme; name: string; icon: string }[] = [
  { id: 'mikesailab', name: 'Mikes AI Lab', icon: '🟦' },
  { id: 'retro-wave', name: 'Retro Wave', icon: '⚡' },
  { id: 'obsidian-cyan', name: 'Obsidian Cyan', icon: '💎' },
  { id: 'carbon-ember', name: 'Carbon Ember', icon: '🔥' },
  { id: 'midnight-violet', name: 'Midnight Violet', icon: '🌙' },
  { id: 'emerald-glass', name: 'Emerald Glass', icon: '🌿' },
  { id: 'solar-flare', name: 'Solar Flare', icon: '☄️' },
  { id: 'sahara-gold', name: 'Sahara Gold', icon: '🏜️' },
  { id: 'terminal-hacker', name: 'Terminal Hacker', icon: '💻' },
  { id: 'github-dark-pro', name: 'GitHub Dark Pro', icon: '🐙' },
  { id: 'void-black', name: 'Void Black', icon: '🖤' },
  { id: 'frosted-steel', name: 'Frosted Steel', icon: '🔩' },
  { id: 'react-modern', name: 'React Modern', icon: '⚛️' },
  { id: 'dark-pro', name: 'Dark Pro', icon: '🎯' },
  { id: 'nordic-night', name: 'Nordic Night', icon: '🌨️' },
  { id: 'light', name: 'Light', icon: '☀️' },
];

export interface SkillPackSummary {
  id: string;
  name: string;
  description: string;
  icon: string;
  version: string;
  tags: string[];
  category: string;
  skillCount: number;
  author: string;
  created_at: string;
  updated_at: string;
}

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  libraryMode: 'public' | 'my';
  setLibraryMode: (mode: 'public' | 'my') => void;
  activeTab: 'agent-guides' | 'agents' | 'prompt-library' | 'skills' | 'system-prompts' | 'skill-packs';
  setActiveTab: (tab: 'agent-guides' | 'agents' | 'prompt-library' | 'skills' | 'system-prompts' | 'skill-packs') => void;
  skillPacks: SkillPackSummary[];
  categories: Record<string, Set<string>>;
  sectionPrompts: Prompt[];
  expandedCategories: Record<string, boolean>;
  setExpandedCategories: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  toggleCategory: (cat: string) => void;
  selectedSubcategory: { category: string; subcategory: string | 'ALL' } | null;
  handleSubcategoryClick: (category: string, subcategory: string | 'ALL') => void;
  handleShowAllPrompts: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export default function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  libraryMode,
  setLibraryMode,
  activeTab,
  setActiveTab,
  skillPacks,
  categories,
  sectionPrompts,
  expandedCategories,
  setExpandedCategories,
  toggleCategory,
  selectedSubcategory,
  handleSubcategoryClick,
  handleShowAllPrompts,
  theme,
  setTheme
}: SidebarProps) {
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const themeRef = useRef<HTMLDivElement>(null);

  // Close theme menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
        setThemeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-[280px] transform transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] md:relative md:translate-x-0",
        !isSidebarOpen && "-translate-x-full md:hidden"
      )}
    >
      <div className="flex flex-col h-full m-3 rounded-[var(--radius-xl)] overflow-hidden sidebar-solid">
        {/* Sidebar header */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => {
                setActiveTab('prompt-library');
                handleShowAllPrompts();
              }}
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[var(--accent-glow-subtle)] border border-[var(--glass-border)] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[var(--accent)]" />
              </div>
              <span className="heading-display text-sm font-bold text-[var(--text-primary)]">Prompt Library</span>
            </button>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 rounded-lg hover:bg-[var(--glass-bg-hover)] transition-colors md:hidden"
            >
              <X className="w-4 h-4 text-[var(--text-tertiary)]" />
            </button>
          </div>
        </div>

        {/* Library Mode Switcher */}
        <div className="px-6 pb-4">
          <div className="flex items-center gap-2 p-1 rounded-[var(--radius-sm)] bg-[var(--glass-bg)] border border-[var(--glass-border)]">
            <button
              onClick={() => setLibraryMode('public')}
              className={cn(
                "flex-1 py-2 px-3 rounded-[var(--radius-sm)] text-[0.7rem] font-semibold tracking-wider uppercase transition-all duration-300",
                libraryMode === 'public'
                  ? "bg-[var(--accent)] text-white shadow-[0_2px_12px_var(--accent-glow)]"
                  : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
              )}
            >
              <div className="flex items-center justify-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Public</span>
              </div>
            </button>
            <button
              onClick={() => setLibraryMode('my')}
              className={cn(
                "flex-1 py-2 px-3 rounded-[var(--radius-sm)] text-[0.7rem] font-semibold tracking-wider uppercase transition-all duration-300",
                libraryMode === 'my'
                  ? "bg-[var(--accent)] text-white shadow-[0_2px_12px_var(--accent-glow)]"
                  : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
              )}
            >
              <div className="flex items-center justify-center gap-1.5">
                <Library className="w-3.5 h-3.5" />
                <span>My Library</span>
              </div>
            </button>
          </div>
        </div>

        {/* Navigation dropdown */}
        <div className="px-6 pb-4">
          <select
            value={activeTab}
            onChange={(e) => {
              setActiveTab(e.target.value as SidebarProps['activeTab']);
              handleShowAllPrompts();
            }}
            className="w-full py-3 px-4 rounded-[var(--radius-sm)] bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[0.75rem] font-semibold tracking-wider uppercase text-[var(--text-primary)] cursor-pointer transition-all duration-300 hover:bg-[var(--glass-bg-hover)] hover:border-[var(--accent)] focus:outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-glow-subtle)]"
          >
            <option value="prompt-library">📚 Prompt Library</option>
            <option value="agents">👤 Agents</option>
            <option value="agent-guides">📖 Agent Guides</option>
            <option value="system-prompts">⚙️ System Prompts</option>
            <option value="skills">🛠️ Skills</option>
            <option value="skill-packs">📦 Skill Packs</option>
          </select>
        </div>

        {/* Category list */}
        <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-1">
          {activeTab === 'skill-packs' ? (
            Object.entries(
              skillPacks.reduce<Record<string, SkillPackSummary[]>>((acc, pack) => {
                if (!acc[pack.category]) acc[pack.category] = [];
                acc[pack.category].push(pack);
                return acc;
              }, {})
            ).sort(([a], [b]) => a.localeCompare(b)).map(([cat, packs]) => (
              <div key={cat}>
                <button
                  onClick={() => setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }))}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 rounded-[var(--radius-sm)] transition-all duration-300 group",
                    expandedCategories[cat]
                      ? "bg-[var(--accent-glow-subtle)]"
                      : "hover:bg-[var(--glass-bg-hover)]"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Package className={cn(
                      "w-3.5 h-3.5 transition-colors",
                      expandedCategories[cat] ? "text-[var(--accent)]" : "text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]"
                    )} />
                    <span className={cn(
                      "text-[0.8rem] font-semibold tracking-tight transition-colors",
                      expandedCategories[cat] ? "text-[var(--accent)]" : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
                    )}>
                      {cat.replace(/_/g, ' ')}
                    </span>
                    <span className={cn(
                      "text-[0.65rem] px-1.5 py-0.5 rounded-full transition-colors",
                      expandedCategories[cat]
                        ? "bg-[var(--accent-glow-subtle)] text-[var(--accent)]"
                        : "bg-[var(--glass-bg)] text-[var(--text-tertiary)]"
                    )}>
                      {packs.length}
                    </span>
                  </div>
                  <ChevronDown className={cn(
                    "w-3.5 h-3.5 transition-all duration-300",
                    expandedCategories[cat]
                      ? "text-[var(--accent)] rotate-0"
                      : "text-[var(--text-tertiary)] -rotate-90"
                  )} />
                </button>

                <AnimatePresence>
                  {expandedCategories[cat] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="ml-3 pl-3 border-l border-[var(--glass-border)] mt-1 mb-2 space-y-0.5">
                        {packs.sort((a, b) => a.name.localeCompare(b.name)).map(pack => (
                          <div
                            key={pack.id}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-[10px] text-[var(--text-tertiary)]"
                          >
                            <Package className="w-3 h-3" />
                            <span className="text-[0.72rem] font-semibold">{pack.name}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          ) : (Object.keys(categories).sort().map(cat => (
            <div key={cat}>
              <button
                onClick={() => toggleCategory(cat)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-[var(--radius-sm)] transition-all duration-300 group",
                  expandedCategories[cat]
                    ? "bg-[var(--accent-glow-subtle)]"
                    : "hover:bg-[var(--glass-bg-hover)]"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <FolderOpen className={cn(
                    "w-3.5 h-3.5 transition-colors",
                    expandedCategories[cat] ? "text-[var(--accent)]" : "text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]"
                  )} />
                  <span className={cn(
                    "text-[0.8rem] font-semibold tracking-tight transition-colors",
                    expandedCategories[cat] ? "text-[var(--accent)]" : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
                  )}>
                    {cat.replace(/_/g, ' ')}
                  </span>
                  <span className={cn(
                    "text-[0.65rem] px-1.5 py-0.5 rounded-full transition-colors",
                    expandedCategories[cat] 
                      ? "bg-[var(--accent-glow-subtle)] text-[var(--accent)]"
                      : "bg-[var(--glass-bg)] text-[var(--text-tertiary)]"
                  )}>
                    {sectionPrompts.filter(p => p.category === cat).length}
                  </span>
                </div>
                <ChevronDown className={cn(
                  "w-3.5 h-3.5 transition-all duration-300",
                  expandedCategories[cat]
                    ? "text-[var(--accent)] rotate-0"
                    : "text-[var(--text-tertiary)] -rotate-90"
                )} />
              </button>

              <AnimatePresence>
                {expandedCategories[cat] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="ml-3 pl-3 border-l border-[var(--glass-border)] mt-1 mb-2 space-y-0.5">
                      <button
                        onClick={() => handleSubcategoryClick(cat, 'ALL')}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-2 rounded-[10px] transition-all duration-200",
                          selectedSubcategory?.category === cat && selectedSubcategory?.subcategory === 'ALL'
                            ? "bg-[var(--accent)] text-white shadow-[0_2px_12px_var(--accent-glow)]"
                            : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--glass-bg-hover)]"
                        )}
                      >
                        <Layers className="w-3 h-3" />
                        <span className="text-[0.72rem] font-semibold">All</span>
                      </button>

                      {Array.from(categories[cat] || []).sort().map(subcat => (
                        <button
                          key={subcat}
                          onClick={() => handleSubcategoryClick(cat, subcat)}
                          className={cn(
                            "w-full flex items-center gap-2 px-3 py-2 rounded-[10px] transition-all duration-200 text-left",
                            selectedSubcategory?.category === cat && selectedSubcategory?.subcategory === subcat
                              ? "bg-[var(--accent-glow-subtle)] text-[var(--accent)]"
                              : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--glass-bg-hover)]"
                          )}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50 shrink-0" />
                          <span className="text-[0.72rem] font-medium truncate">{subcat.replace(/_/g, ' ')}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )))}
        </div>

        {/* Theme selector at bottom */}
        <div className="p-4 border-t border-[var(--glass-border)]" ref={themeRef}>
          <div className="relative">
            <button
              onClick={() => setThemeMenuOpen(!themeMenuOpen)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-[var(--radius-sm)] hover:bg-[var(--glass-bg-hover)] transition-all"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-sm">{THEMES.find(t => t.id === theme)?.icon}</span>
                <span className="text-[0.75rem] font-medium text-[var(--text-secondary)]">{THEMES.find(t => t.id === theme)?.name}</span>
              </div>
              <ChevronDown className={cn(
                "w-3.5 h-3.5 text-[var(--text-tertiary)] transition-transform duration-300",
                themeMenuOpen && "rotate-180"
              )} />
            </button>

            <AnimatePresence>
              {themeMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-full left-0 right-0 mb-2 rounded-[var(--radius-md)] bg-[var(--sidebar-bg)] backdrop-blur-xl border border-[var(--glass-border)] p-1.5 z-[9999] max-h-[320px] overflow-y-auto shadow-2xl"
                  style={{ backgroundColor: 'var(--sidebar-bg)' }}
                >
                  {THEMES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => { setTheme(t.id); setThemeMenuOpen(false); }}
                      className={cn(
                        "flex items-center gap-2.5 w-full px-3 py-2.5 rounded-[10px] text-[0.72rem] font-medium transition-all",
                        theme === t.id
                          ? "bg-[var(--accent)] text-white shadow-[0_2px_12px_var(--accent-glow)]"
                          : "text-[var(--text-secondary)] hover:bg-[var(--glass-bg-hover)] hover:text-[var(--text-primary)]"
                      )}
                    >
                      <span className="text-sm">{t.icon}</span>
                      {t.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </aside>
  );
}
