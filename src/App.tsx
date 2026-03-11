/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useRef } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  Search,
  Menu,
  X,
  Terminal,
  FileText,
  LayoutGrid,
  Library,
  Sparkles,
  ArrowLeft,
  Clock,
  Tag,
  FolderOpen,
  Layers
} from 'lucide-react';
import Markdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'motion/react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Prompt {
  id: string;
  title: string;
  category: string;
  subcategory: string | null;
  tags: string[];
  content: string;
  lastModified: string;
}

type Theme = 'light' | 'retro-wave' | 'emerald-glass' | 'obsidian-cyan' | 'carbon-ember' | 'midnight-violet' | 'solar-flare' | 'sahara-gold' | 'frosted-steel' | 'terminal-hacker' | 'github-dark-pro';

const THEMES: { id: Theme; name: string; icon: string }[] = [
  { id: 'retro-wave', name: 'Retro Wave', icon: '⚡' },
  { id: 'obsidian-cyan', name: 'Obsidian Cyan', icon: '💎' },
  { id: 'carbon-ember', name: 'Carbon Ember', icon: '🔥' },
  { id: 'midnight-violet', name: 'Midnight Violet', icon: '🌙' },
  { id: 'emerald-glass', name: 'Emerald Glass', icon: '🌿' },
  { id: 'solar-flare', name: 'Solar Flare', icon: '☄️' },
  { id: 'sahara-gold', name: 'Sahara Gold', icon: '🏜️' },
  { id: 'terminal-hacker', name: 'Terminal Hacker', icon: '💻' },
  { id: 'github-dark-pro', name: 'GitHub Dark Pro', icon: '🐙' },
  { id: 'frosted-steel', name: 'Frosted Steel', icon: '🔩' },
  { id: 'light', name: 'Light', icon: '☀️' },
];

const FIXED_CATEGORIES = [
  "Business",
  "Finance",
  "Images",
  "IT",
  "MCP_Servers",
  "Social_Media",
  "Video",
  "Writing"
];

export default function App() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<{category: string, subcategory: string | 'ALL'} | null>(null);
  const [showAllPrompts, setShowAllPrompts] = useState(true);
  const [theme, setTheme] = useState<Theme>('retro-wave');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'collections'>('all');
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const themeRef = useRef<HTMLDivElement>(null);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    fetch('/api/prompts')
      .then(res => res.json())
      .then(data => setPrompts(data))
      .catch(err => console.error('Failed to fetch prompts:', err));
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

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

  const categories = useMemo(() => {
    const map: Record<string, Set<string>> = {};
    prompts.forEach(p => {
      if (!map[p.category]) map[p.category] = new Set();
      if (p.subcategory) map[p.category].add(p.subcategory);
    });
    return map;
  }, [prompts]);

  const filteredPrompts = useMemo(() => {
    return prompts.filter(p =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [prompts, searchQuery]);

  const subcategoryPrompts = useMemo(() => {
    if (!selectedSubcategory) return [];
    if (selectedSubcategory.subcategory === 'ALL') {
      return filteredPrompts.filter(p => p.category === selectedSubcategory.category);
    }
    return filteredPrompts.filter(p =>
      p.category === selectedSubcategory.category &&
      p.subcategory === selectedSubcategory.subcategory
    );
  }, [selectedSubcategory, filteredPrompts]);

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const handleSubcategoryClick = (category: string, subcategory: string | 'ALL') => {
    setSelectedSubcategory({ category, subcategory });
    setSelectedPrompt(null);
    setShowAllPrompts(false);
  };

  const handlePromptClick = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setSelectedSubcategory(null);
    setShowAllPrompts(false);
  };

  const handleShowAllPrompts = () => {
    setShowAllPrompts(true);
    setSelectedPrompt(null);
    setSelectedSubcategory(null);
    setActiveTab('all');
  };

  const handleBack = () => {
    if (selectedPrompt && selectedSubcategory) {
      setSelectedPrompt(null);
    } else {
      handleShowAllPrompts();
    }
  };

  const handleCopy = (content: string, promptId: string) => {
    navigator.clipboard.writeText(content);
    setCopied(promptId);
    setTimeout(() => setCopied(null), 2000);
  };

  // Prompt card component for reuse
  const PromptCard = ({ prompt, index }: { prompt: Prompt; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: [0.4, 0, 0.2, 1] }}
      key={prompt.id}
      className="glass-card rounded-[var(--radius-lg)] p-6 relative group cursor-pointer overflow-hidden"
      onClick={() => handlePromptClick(prompt)}
    >
      {/* Hover glow accent */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-[var(--accent-glow-subtle)] blur-[60px]" />
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleCopy(prompt.content, prompt.id);
        }}
        className="absolute top-5 right-5 p-2.5 rounded-[var(--radius-sm)] bg-[var(--glass-bg)] hover:bg-[var(--accent)] text-[var(--text-tertiary)] hover:text-white transition-all duration-300 border border-[var(--glass-border)] hover:border-[var(--accent)] hover:shadow-[0_0_24px_var(--accent-glow)] z-10 backdrop-blur-sm"
      >
        {copied === prompt.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      </button>

      <div className="space-y-4 relative z-[1]">
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-[var(--radius-sm)] bg-[var(--accent-glow-subtle)] flex items-center justify-center shrink-0 border border-[var(--glass-border)]">
            <FileText className="w-4 h-4 text-[var(--accent)]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="heading-display text-base font-bold tracking-tight leading-snug mb-1.5 pr-10 text-[var(--text-primary)]">
              {prompt.title}
            </h3>
            <p className="label truncate">
              {prompt.category}{prompt.subcategory ? ` / ${prompt.subcategory.replace(/_/g, ' ')}` : ''}
            </p>
          </div>
        </div>

        {prompt.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {prompt.tags.slice(0, 3).map(tag => (
              <span key={tag} className="px-2.5 py-1 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[0.6rem] font-semibold tracking-wider uppercase text-[var(--text-tertiary)]">
                {tag}
              </span>
            ))}
            {prompt.tags.length > 3 && (
              <span className="px-2.5 py-1 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[0.6rem] font-semibold tracking-wider uppercase text-[var(--text-tertiary)]">
                +{prompt.tags.length - 3}
              </span>
            )}
          </div>
        )}

        <p className="text-[0.82rem] text-[var(--text-tertiary)] line-clamp-3 leading-relaxed">
          {prompt.content.substring(0, 160)}...
        </p>
      </div>
    </motion.div>
  );

  return (
    <div className="flex h-screen overflow-hidden font-[var(--font-sans)]">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[280px] transform transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] md:relative md:translate-x-0",
          !isSidebarOpen && "-translate-x-full md:hidden"
        )}
      >
        <div className="flex flex-col h-full glass m-3 rounded-[var(--radius-xl)] overflow-hidden">
          {/* Sidebar header */}
          <div className="p-6 pb-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[var(--accent-glow-subtle)] border border-[var(--glass-border)] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                </div>
                <span className="heading-display text-sm font-bold text-[var(--text-primary)]">Prompts</span>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 rounded-lg hover:bg-[var(--glass-bg-hover)] transition-colors md:hidden"
              >
                <X className="w-4 h-4 text-[var(--text-tertiary)]" />
              </button>
            </div>

            {/* Search */}
            <div className={cn(
              "relative rounded-[var(--radius-sm)] border transition-all duration-300",
              searchFocused ? "border-[var(--accent)] shadow-[0_0_20px_var(--accent-glow-subtle)]" : "border-[var(--glass-border)]"
            )}>
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-tertiary)]" />
              <input
                type="text"
                placeholder="Search prompts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full bg-[var(--glass-bg)] pl-10 pr-4 py-2.5 rounded-[var(--radius-sm)] text-[0.8rem] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none"
              />
            </div>
          </div>

          {/* Navigation tabs */}
          <div className="px-6 pb-4">
            <div className="flex gap-1.5 p-1 rounded-[var(--radius-sm)] bg-[var(--glass-bg)]">
              <button
                onClick={handleShowAllPrompts}
                className={cn(
                  "flex-1 py-2 px-3 rounded-[10px] text-[0.65rem] font-semibold tracking-wider uppercase transition-all duration-300",
                  showAllPrompts
                    ? "bg-[var(--accent)] text-white shadow-[0_2px_12px_var(--accent-glow)]"
                    : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                )}
              >
                All
              </button>
              <button
                onClick={() => { setActiveTab('collections'); setShowAllPrompts(false); setSelectedPrompt(null); }}
                className={cn(
                  "flex-1 py-2 px-3 rounded-[10px] text-[0.65rem] font-semibold tracking-wider uppercase transition-all duration-300",
                  activeTab === 'collections' && !showAllPrompts
                    ? "bg-[var(--accent)] text-white shadow-[0_2px_12px_var(--accent-glow)]"
                    : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                )}
              >
                Collections
              </button>
            </div>
          </div>

          {/* Category list */}
          <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-1">
            {FIXED_CATEGORIES.map(cat => (
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
            ))}
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
                    className="absolute bottom-full left-0 right-0 mb-2 rounded-[var(--radius-md)] glass border border-[var(--glass-border)] p-1.5 z-50 max-h-[320px] overflow-y-auto shadow-xl"
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <div className="shrink-0 px-6 md:px-10 pt-8 pb-6">
          <div className="flex items-start justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-4">
                {/* Mobile menu */}
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 rounded-[var(--radius-sm)] hover:bg-[var(--glass-bg-hover)] transition-colors md:hidden"
                >
                  <Menu className="w-5 h-5 text-[var(--text-secondary)]" />
                </button>

                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse-glow" />
                  <span className="label">AI Prompt Library</span>
                </div>
              </div>

              <h1 className="heading-display text-5xl md:text-7xl font-extrabold leading-none">
                <span className="text-[var(--text-primary)]">Prompt</span>
                <br />
                <span className="neon-text">Library</span>
              </h1>

              <p className="max-w-lg text-[0.85rem] text-[var(--text-tertiary)] font-medium leading-relaxed">
                A general-purpose prompt library for multiple AI tools.
                Organize by category, copy fast, and iterate.
              </p>
            </div>

            {/* Stat badges */}
            <div className="hidden md:flex items-center gap-3 pt-12">
              <div className="glass rounded-[var(--radius-md)] px-5 py-3 text-center min-w-[90px]">
                <div className="heading-display text-2xl font-bold text-[var(--accent)]">{prompts.length}</div>
                <div className="label mt-1">Prompts</div>
              </div>
              <div className="glass rounded-[var(--radius-md)] px-5 py-3 text-center min-w-[90px]">
                <div className="heading-display text-2xl font-bold text-[var(--text-primary)]">{Object.keys(categories).length}</div>
                <div className="label mt-1">Categories</div>
              </div>
            </div>
          </div>

          {/* Accent line separator */}
          <div className="accent-line w-full mt-6 opacity-40" />
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-6 md:px-10 pb-10">
          <AnimatePresence mode="wait">
            {/* All Prompts Grid */}
            {showAllPrompts ? (
              <motion.div
                key="all-prompts"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="max-w-[1600px] mx-auto"
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="heading-display text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                      All Prompts
                    </h2>
                    <p className="label mt-2">{filteredPrompts.length} prompts</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredPrompts.map((prompt, i) => (
                    <PromptCard key={prompt.id} prompt={prompt} index={i} />
                  ))}
                </div>
              </motion.div>

            ) : selectedSubcategory && subcategoryPrompts.length > 0 ? (
              /* Subcategory Grid */
              <motion.div
                key={`subcat-${selectedSubcategory.category}-${selectedSubcategory.subcategory}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="max-w-[1600px] mx-auto"
              >
                <div className="flex items-center gap-4 mb-8">
                  <button
                    onClick={handleShowAllPrompts}
                    className="p-2 rounded-[var(--radius-sm)] hover:bg-[var(--glass-bg-hover)] transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 text-[var(--text-tertiary)]" />
                  </button>
                  <div>
                    <h2 className="heading-display text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                      {selectedSubcategory.category.replace(/_/g, ' ')}
                      <span className="text-[var(--text-tertiary)] mx-2">/</span>
                      <span className="text-[var(--accent)]">
                        {selectedSubcategory.subcategory === 'ALL' ? 'All' : selectedSubcategory.subcategory.replace(/_/g, ' ')}
                      </span>
                    </h2>
                    <p className="label mt-2">{subcategoryPrompts.length} prompts</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {subcategoryPrompts.map((prompt, i) => (
                    <PromptCard key={prompt.id} prompt={prompt} index={i} />
                  ))}
                </div>
              </motion.div>

            ) : selectedPrompt ? (
              /* Single Prompt Detail */
              <motion.div
                key={`prompt-${selectedPrompt.id}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1600px] mx-auto"
              >
                {/* Main content */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Back & title bar */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleBack}
                      className="p-2.5 rounded-[var(--radius-sm)] glass border-[var(--glass-border)] hover:border-[var(--accent)] transition-all"
                    >
                      <ArrowLeft className="w-4 h-4 text-[var(--text-secondary)]" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <h2 className="heading-display text-xl font-bold tracking-tight text-[var(--text-primary)] truncate">
                        {selectedPrompt.title}
                      </h2>
                      <p className="label mt-0.5 truncate">{selectedPrompt.id}</p>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCopy(selectedPrompt.content, selectedPrompt.id)}
                      className={cn(
                        "flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-sm)] text-[0.7rem] font-semibold tracking-wider uppercase transition-all duration-300 border shrink-0",
                        copied === selectedPrompt.id
                          ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                          : "glass border-[var(--glass-border)] hover:border-[var(--accent)] hover:shadow-[0_0_24px_var(--accent-glow-subtle)]"
                      )}
                    >
                      {copied === selectedPrompt.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied === selectedPrompt.id ? 'Copied' : 'Copy'}
                    </motion.button>
                  </div>

                  {/* Content card */}
                  <div className="glass-card rounded-[var(--radius-xl)] p-8 md:p-10 relative overflow-hidden">
                    {/* Tags */}
                    {selectedPrompt.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-8">
                        {selectedPrompt.tags.map(tag => (
                          <span key={tag} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[0.65rem] font-semibold tracking-wider uppercase text-[var(--text-tertiary)]">
                            <Tag className="w-2.5 h-2.5" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="markdown-body prose prose-invert max-w-none">
                      <Markdown>{selectedPrompt.content}</Markdown>
                    </div>

                    {/* Decorative corner glow */}
                    <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-[var(--accent-glow-subtle)] rounded-full blur-[120px] pointer-events-none" />
                  </div>
                </div>

                {/* Sidebar metadata */}
                <div className="lg:col-span-4 space-y-5">
                  <div className="glass rounded-[var(--radius-lg)] p-6 space-y-5">
                    <h3 className="label">Metadata</h3>
                    <div className="space-y-0">
                      {[
                        { label: 'Category', value: selectedPrompt.category.replace(/_/g, ' '), icon: FolderOpen },
                        { label: 'Subcategory', value: selectedPrompt.subcategory?.replace(/_/g, ' ') || 'None', icon: Layers },
                        { label: 'Modified', value: new Date(selectedPrompt.lastModified).toLocaleDateString(), icon: Clock },
                      ].map(({ label, value, icon: Icon }) => (
                        <div key={label} className="flex items-center justify-between py-3.5 border-b border-[var(--glass-border)] last:border-0">
                          <div className="flex items-center gap-2">
                            <Icon className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
                            <span className="text-[0.78rem] font-medium text-[var(--text-tertiary)]">{label}</span>
                          </div>
                          <span className="text-[0.78rem] font-semibold text-[var(--text-primary)]">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass rounded-[var(--radius-lg)] p-6 space-y-4">
                    <h3 className="label">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        onClick={() => {
                          if (selectedPrompt.subcategory) {
                            handleSubcategoryClick(selectedPrompt.category, selectedPrompt.subcategory);
                          }
                        }}
                        className="flex flex-col items-center justify-center gap-2.5 p-5 rounded-[var(--radius-md)] bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-[var(--accent)] hover:bg-[var(--accent-glow-subtle)] transition-all duration-300 group"
                      >
                        <LayoutGrid className="w-4.5 h-4.5 text-[var(--text-tertiary)] group-hover:text-[var(--accent)] transition-colors" />
                        <span className="text-[0.6rem] font-semibold tracking-wider uppercase text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)] transition-colors">Grid View</span>
                      </button>
                      <button
                        onClick={handleShowAllPrompts}
                        className="flex flex-col items-center justify-center gap-2.5 p-5 rounded-[var(--radius-md)] bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-[var(--accent)] hover:bg-[var(--accent-glow-subtle)] transition-all duration-300 group"
                      >
                        <Library className="w-4.5 h-4.5 text-[var(--text-tertiary)] group-hover:text-[var(--accent)] transition-colors" />
                        <span className="text-[0.6rem] font-semibold tracking-wider uppercase text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)] transition-colors">Library</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>

            ) : (
              /* Empty state */
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-8"
              >
                <div className="relative">
                  <div className="w-28 h-28 rounded-full border-2 border-dashed border-[var(--glass-border)] flex items-center justify-center animate-[spin_30s_linear_infinite]">
                    <Terminal className="w-10 h-10 text-[var(--text-tertiary)]" />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-[var(--accent-glow-subtle)] blur-[40px] pointer-events-none" />
                </div>
                <div className="space-y-2">
                  <p className="heading-display text-xl font-bold text-[var(--text-tertiary)]">System Ready</p>
                  <p className="text-[0.8rem] font-medium text-[var(--text-tertiary)] opacity-60">Select a category or subcategory to begin</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
