/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useRef, useCallback, memo } from 'react';
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
  Layers,
  Plus,
  FolderPlus,
  Edit,
  Trash2,
  Star,
  Home,
  ChevronRight as BreadcrumbArrow,
  Github,
  ExternalLink,
  BookOpen,
  Bot
} from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'motion/react';
import PromptEditorModal from './components/PromptEditorModal';
import { ToastContainer, type ToastProps } from './components/Toast';
import Fuse from 'fuse.js';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Prompt {
  id: string;
  title: string;
  section: string;
  category: string;
  subcategory: string | null;
  tags: string[];
  content: string;
  lastModified: string;
}

type Theme = 'light' | 'retro-wave' | 'emerald-glass' | 'obsidian-cyan' | 'carbon-ember' | 'midnight-violet' | 'solar-flare' | 'sahara-gold' | 'void-black' | 'frosted-steel' | 'terminal-hacker' | 'github-dark-pro' | 'react-modern' | 'dark-pro' | 'nordic-night';

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
  { id: 'void-black', name: 'Void Black', icon: '🖤' },
  { id: 'frosted-steel', name: 'Frosted Steel', icon: '🔩' },
  { id: 'react-modern', name: 'React Modern', icon: '⚛️' },
  { id: 'dark-pro', name: 'Dark Pro', icon: '🎯' },
  { id: 'nordic-night', name: 'Nordic Night', icon: '🌨️' },
  { id: 'light', name: 'Light', icon: '☀️' },
];

export default function App() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<{category: string, subcategory: string | 'ALL'} | null>(null);
  const [showAllPrompts, setShowAllPrompts] = useState(true);
  const [theme, setTheme] = useState<Theme>('github-dark-pro');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<'title-asc' | 'title-desc' | 'modified-desc' | 'modified-asc'>('title-asc');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [copyingToMyPromptsId, setCopyingToMyPromptsId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'my-prompts' | 'collections' | 'system-prompts' | 'agent-guides'>('my-prompts');
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const themeRef = useRef<HTMLDivElement>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  
  // External Resources Dropdowns
  const [cliReposOpen, setCliReposOpen] = useState(false);
  const [promptLibsOpen, setPromptLibsOpen] = useState(false);
  const [agentTemplatesOpen, setAgentTemplatesOpen] = useState(false);
  
  // Navigation & Organization
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('prompt-favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    const saved = localStorage.getItem('prompt-recently-viewed');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Sidebar section expansion (default closed)
  const [favoritesExpanded, setFavoritesExpanded] = useState(false);
  const [recentlyViewedExpanded, setRecentlyViewedExpanded] = useState(false);
  const [tagsExpanded, setTagsExpanded] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);

  const showToast = useCallback((type: ToastProps['type'], message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, type, message, onClose: () => {} }]);
  }, []);

  const closeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Persist favorites and recently viewed to localStorage
  useEffect(() => {
    localStorage.setItem('prompt-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('prompt-recently-viewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  // Debounce search input for better performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/prompts')
      .then(res => res.json())
      .then(data => {
        console.log('🔍 DEBUG: Fetched prompts:', data.length);
        console.log('🔍 DEBUG: First prompt:', data[0]);
        console.log('🔍 DEBUG: Sections:', [...new Set(data.map((p: Prompt) => p.section))]);
        setPrompts(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch prompts:', err);
        showToast('error', 'Failed to load prompts');
        setIsLoading(false);
      });
  }, [showToast]);

  // Close external resource dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.external-resource-dropdown')) {
        setCliReposOpen(false);
        setPromptLibsOpen(false);
        setAgentTemplatesOpen(false);
      }
    };

    if (cliReposOpen || promptLibsOpen || agentTemplatesOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [cliReposOpen, promptLibsOpen, agentTemplatesOpen]);

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

  // Close filter dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.filter-dropdown')) {
        setFavoritesExpanded(false);
        setRecentlyViewedExpanded(false);
        setTagsExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const activeSection = 
    activeTab === 'my-prompts' ? 'My_Prompts' : 
    activeTab === 'collections' ? 'Collections' : 
    activeTab === 'system-prompts' ? 'System_Prompts' : 
    'Agent_Guides';

  const sectionPrompts = useMemo(() => {
    const filtered = prompts.filter(p => p.section === activeSection);
    console.log(`🔍 DEBUG: activeSection="${activeSection}", sectionPrompts=${filtered.length}/${prompts.length}`);
    return filtered;
  }, [prompts, activeSection]);

  const categories = useMemo(() => {
    const map: Record<string, Set<string>> = {};
    sectionPrompts.forEach(p => {
      if (!map[p.category]) map[p.category] = new Set();
      if (p.subcategory) map[p.category].add(p.subcategory);
    });
    return map;
  }, [sectionPrompts]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    sectionPrompts.forEach(p => {
      p.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [sectionPrompts]);

  const filteredPrompts = useMemo(() => {
    let currentPrompts = sectionPrompts.filter(prompt => {
      if (activeTab === 'my-prompts' && !prompt.id.startsWith('My_Prompts/')) return false;
      if (activeTab === 'collections' && !prompt.id.startsWith('Collections/')) return false;
      if (activeTab === 'system-prompts' && !prompt.id.startsWith('System_Prompts/')) return false;
      if (activeTab === 'agent-guides' && !prompt.id.startsWith('Agent_Guides/')) return false;
      return true;
    });
    console.log(`🔍 DEBUG: activeTab="${activeTab}", after path filter=${currentPrompts.length}/${sectionPrompts.length}`);

    // Apply tag filters
    if (selectedTags.length > 0) {
      currentPrompts = currentPrompts.filter(prompt =>
        selectedTags.every(tag => prompt.tags.includes(tag))
      );
    }

    // Apply fuzzy search
    if (!debouncedSearch) {
      return currentPrompts;
    }

    const fuse = new Fuse(currentPrompts, {
      keys: ['title', 'content', 'tags', 'category', 'subcategory'],
      includeScore: true,
      threshold: 0.3, // Fuzziness (0 = exact match, 1 = any match)
      ignoreLocation: true,
      minMatchCharLength: 2,
    });

    return fuse.search(debouncedSearch).map(result => result.item);
  }, [sectionPrompts, debouncedSearch, activeTab, selectedTags]);

  const sortedPrompts = useMemo(() => {
    const promptsToSort = [...filteredPrompts];
    
    switch (sortOption) {
      case 'title-asc':
        return promptsToSort.sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':
        return promptsToSort.sort((a, b) => b.title.localeCompare(a.title));
      case 'modified-desc':
        return promptsToSort.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
      case 'modified-asc':
        return promptsToSort.sort((a, b) => new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime());
      default:
        return promptsToSort;
    }
  }, [filteredPrompts, sortOption]);

  const subcategoryPrompts = useMemo(() => {
    if (!selectedSubcategory) return [];
    if (selectedSubcategory.subcategory === 'ALL') {
      return sortedPrompts.filter(p => p.category === selectedSubcategory.category);
    }
    return sortedPrompts.filter(p =>
      p.category === selectedSubcategory.category &&
      p.subcategory === selectedSubcategory.subcategory
    );
  }, [selectedSubcategory, sortedPrompts]);

  // Get favorite prompts
  const favoritePrompts = useMemo(() => {
    return prompts.filter(p => favorites.includes(p.id));
  }, [prompts, favorites]);

  // Get recently viewed prompts
  const recentlyViewedPrompts = useMemo(() => {
    return recentlyViewed
      .map(id => prompts.find(p => p.id === id))
      .filter((p): p is Prompt => p !== undefined);
  }, [prompts, recentlyViewed]);

  const toggleCategory = useCallback((cat: string) => {
    setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  }, []);

  const handleSubcategoryClick = useCallback((category: string, subcategory: string | 'ALL') => {
    setSelectedSubcategory({ category, subcategory });
    setSelectedPrompt(null);
    setShowAllPrompts(false);
  }, []);

  const handlePromptClick = useCallback((prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setSelectedSubcategory(null);
    setShowAllPrompts(false);
    
    // Track in recently viewed
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== prompt.id);
      return [prompt.id, ...filtered].slice(0, 10); // Keep last 10
    });
  }, []);

  const handleShowAllPrompts = useCallback(() => {
    setShowAllPrompts(true);
    setSelectedPrompt(null);
    setSelectedSubcategory(null);
  }, []);

  const handleBack = useCallback(() => {
    if (selectedPrompt && selectedSubcategory) {
      setSelectedPrompt(null);
    } else {
      handleShowAllPrompts();
    }
  }, [selectedPrompt, selectedSubcategory, handleShowAllPrompts]);

  const handleCopy = useCallback((content: string, promptId: string) => {
    navigator.clipboard.writeText(content);
    setCopied(promptId);
    setTimeout(() => setCopied(null), 2000);
    showToast('success', 'Copied to clipboard');
  }, [showToast]);

  const toggleFavorite = useCallback((promptId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setFavorites(prev => {
      if (prev.includes(promptId)) {
        return prev.filter(id => id !== promptId);
      } else {
        return [...prev, promptId];
      }
    });
  }, []);

  const handleTagToggle = useCallback((tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  }, []);

  const refreshPrompts = useCallback(() => {
    fetch('/api/prompts')
      .then(res => res.json())
      .then(data => setPrompts(data))
      .catch(err => console.error('Failed to fetch prompts:', err));
  }, []);

  const handleCopyToMyPrompts = useCallback(async (prompt: Prompt) => {
    if (prompt.section === 'My_Prompts') {
      showToast('info', 'This prompt is already in My Prompts');
      return;
    }

    setCopyingToMyPromptsId(prompt.id);

    try {
      const response = await fetch(`/api/prompts/${encodeURIComponent(prompt.id)}/copy-to-my-prompts`, {
        method: 'POST'
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Failed to copy prompt to My Prompts');
      }

      refreshPrompts();
      showToast('success', payload.message || 'Copied to My Prompts');
    } catch (error: any) {
      showToast('error', error.message || 'Failed to copy prompt to My Prompts');
    } finally {
      setCopyingToMyPromptsId(null);
    }
  }, [refreshPrompts, showToast]);

  const handleSavePrompt = useCallback(async (prompt: Omit<Prompt, 'lastModified'>) => {
    const method = prompt.id ? 'PUT' : 'POST';
    const url = prompt.id ? `/api/prompts/${encodeURIComponent(prompt.id)}` : '/api/prompts';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prompt)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save prompt');
      }

      refreshPrompts();
      showToast('success', prompt.id ? 'Prompt updated successfully' : 'Prompt created successfully');
    } catch (error: any) {
      showToast('error', error.message || 'Failed to save prompt');
      throw error;
    }
  }, [refreshPrompts, showToast]);

  const handleDeletePrompt = useCallback(async (promptId: string) => {
    if (!confirm('Are you sure you want to delete this prompt? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/prompts/${encodeURIComponent(promptId)}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete prompt');
      }

      refreshPrompts();
      showToast('success', 'Prompt deleted successfully');
      
      if (selectedPrompt?.id === promptId) {
        setSelectedPrompt(null);
        setShowAllPrompts(true);
      }
    } catch (error: any) {
      showToast('error', error.message || 'Failed to delete prompt');
    }
  }, [refreshPrompts, selectedPrompt, showToast]);

  const handleEditPrompt = useCallback((prompt: Prompt) => {
    setEditingPrompt(prompt);
    setIsEditorOpen(true);
  }, []);

  const handleNewPrompt = useCallback(() => {
    setEditingPrompt(null);
    setIsEditorOpen(true);
  }, []);

  // Prompt card component for reuse (memoized for performance)
  const PromptCard = memo(({ prompt, index }: { prompt: Prompt; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: [0.4, 0, 0.2, 1] }}
      key={prompt.id}
      className="glass-card rounded-[var(--radius-lg)] relative group cursor-pointer overflow-hidden flex"
      onClick={() => handlePromptClick(prompt)}
    >
      {/* Hover glow accent */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-[var(--accent-glow-subtle)] blur-[60px]" />
      </div>

      {/* Main content area */}
      <div className="flex-1 p-6 space-y-4 relative z-[1]">
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-[var(--radius-sm)] bg-[var(--accent-glow-subtle)] flex items-center justify-center shrink-0 border border-[var(--glass-border)]">
            <FileText className="w-4 h-4 text-[var(--accent)]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="heading-display text-base font-bold tracking-tight leading-snug mb-1.5 text-[var(--text-primary)]">
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

      {/* Button column with separator */}
      <div className="flex flex-col gap-2 p-3 border-l border-[var(--glass-border)] relative z-10 justify-center">
        <button
          onClick={(e) => toggleFavorite(prompt.id, e)}
          className={cn(
            "p-2 rounded-[var(--radius-sm)] bg-[var(--glass-bg)] transition-all duration-300 border backdrop-blur-sm",
            favorites.includes(prompt.id)
              ? "text-yellow-400 border-yellow-400/50 hover:bg-yellow-400/20"
              : "text-[var(--text-tertiary)] border-[var(--glass-border)] hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)]"
          )}
          title={favorites.includes(prompt.id) ? "Remove from favorites" : "Add to favorites"}
        >
          <Star className={cn("w-3.5 h-3.5", favorites.includes(prompt.id) && "fill-yellow-400")} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleEditPrompt(prompt);
          }}
          className="p-2 rounded-[var(--radius-sm)] bg-[var(--glass-bg)] hover:bg-[var(--accent)] text-[var(--text-tertiary)] hover:text-white transition-all duration-300 border border-[var(--glass-border)] hover:border-[var(--accent)] hover:shadow-[0_0_24px_var(--accent-glow)] backdrop-blur-sm"
          title="Edit prompt"
        >
          <Edit className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeletePrompt(prompt.id);
          }}
          className="p-2 rounded-[var(--radius-sm)] bg-[var(--glass-bg)] hover:bg-red-500 text-[var(--text-tertiary)] hover:text-white transition-all duration-300 border border-[var(--glass-border)] hover:border-red-500 backdrop-blur-sm"
          title="Delete prompt"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCopy(prompt.content, prompt.id);
          }}
          className="p-2 rounded-[var(--radius-sm)] bg-[var(--glass-bg)] hover:bg-[var(--accent)] text-[var(--text-tertiary)] hover:text-white transition-all duration-300 border border-[var(--glass-border)] hover:border-[var(--accent)] hover:shadow-[0_0_24px_var(--accent-glow)] backdrop-blur-sm"
          title="Copy content"
        >
          {copied === prompt.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
    </motion.div>
  ));

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
        <div className="flex flex-col h-full m-3 rounded-[var(--radius-xl)] overflow-hidden sidebar-solid">
          {/* Sidebar header */}
          <div className="p-6 pb-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[var(--accent-glow-subtle)] border border-[var(--glass-border)] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                </div>
                <span className="heading-display text-sm font-bold text-[var(--text-primary)]">Prompt Library</span>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 rounded-lg hover:bg-[var(--glass-bg-hover)] transition-colors md:hidden"
              >
                <X className="w-4 h-4 text-[var(--text-tertiary)]" />
              </button>
            </div>

          </div>

          {/* Navigation dropdown */}
          <div className="px-6 pb-4">
            <select
              value={activeTab}
              onChange={(e) => {
                setActiveTab(e.target.value as typeof activeTab);
                setShowAllPrompts(true);
                setSelectedPrompt(null);
                setSelectedSubcategory(null);
              }}
              className="w-full py-3 px-4 rounded-[var(--radius-sm)] bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[0.75rem] font-semibold tracking-wider uppercase text-[var(--text-primary)] cursor-pointer transition-all duration-300 hover:bg-[var(--glass-bg-hover)] hover:border-[var(--accent)] focus:outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-glow-subtle)]"
            >
              <option value="my-prompts">📝 My Prompts</option>
              <option value="collections">📚 Collections</option>
              <option value="system-prompts">⚙️ System Prompts</option>
              <option value="agent-guides">🤖 Agent Guides</option>
            </select>
          </div>



          {/* Category list */}
          <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-1">
            {Object.keys(categories).sort().map(cat => (
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

            {/* Attribution */}
            <div className="mt-3 pt-3 border-t border-[var(--glass-border)]">
              <p className="text-[0.7rem] text-center text-[var(--text-tertiary)]">
                Built on the{' '}
                <a
                  href="https://ax-platform.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  aX Platform
                </a>
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Bar with Mobile Menu and Filters */}
        <div className="shrink-0 px-4 md:px-6 py-3 border-b border-[var(--glass-border)]">
          <div className="flex items-center gap-4">
            {/* Mobile menu */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-[var(--radius-sm)] hover:bg-[var(--glass-bg-hover)] transition-colors md:hidden"
            >
              <Menu className="w-5 h-5 text-[var(--text-secondary)]" />
            </button>

            {/* aX Platform - Mobile (top right) */}
            <a
              href="https://ax-platform.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="md:hidden ml-auto flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-slate-800 to-slate-900 border-2 border-slate-700 hover:border-blue-500 transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] group"
            >
              <span className="text-xs font-bold text-slate-100 tracking-wide">aX-</span>
              <div className="w-px h-3.5 bg-slate-600 group-hover:bg-blue-500 transition-colors"></div>
              <span className="text-xs font-bold text-blue-400 group-hover:text-blue-300 transition-colors tracking-wide">Platform</span>
            </a>

            {/* External Resources Dropdowns */}
            <div className="hidden md:flex items-center gap-3 ml-auto">
              {/* aX Platform Standalone Link */}
              <a
                href="https://ax-platform.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-slate-800 to-slate-900 border-2 border-slate-700 hover:border-blue-500 transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] group"
              >
                <span className="text-sm font-bold text-slate-100 tracking-wide">aX-</span>
                <div className="w-px h-4 bg-slate-600 group-hover:bg-blue-500 transition-colors"></div>
                <span className="text-sm font-bold text-blue-400 group-hover:text-blue-300 transition-colors tracking-wide">Platform</span>
              </a>

              {/* CLI Repos */}
              <div className="relative external-resource-dropdown">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCliReposOpen(!cliReposOpen);
                    setPromptLibsOpen(false);
                    setAgentTemplatesOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-subtle border border-[var(--glass-border)] hover:border-[var(--accent)] transition-colors text-xs"
                >
                  <Terminal className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span className="font-semibold text-[var(--text-secondary)]">CLI</span>
                  <ChevronDown className={cn(
                    "w-3 h-3 text-[var(--text-tertiary)] transition-transform",
                    cliReposOpen && "rotate-180"
                  )} />
                </button>
                <AnimatePresence>
                  {cliReposOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-2 z-[100] w-56 dropdown-solid rounded-[var(--radius-md)] p-2 shadow-xl border border-[var(--glass-border)]"
                    >
                    <a
                      href="https://github.com/anthropics/claude-code"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-[var(--glass-bg-hover)] transition-colors group"
                    >
                      <Github className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-[var(--accent)]" />
                      <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--accent)]">Claude Code</span>
                      <ExternalLink className="w-3 h-3 text-[var(--text-tertiary)] ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                    <a
                      href="https://github.com/google-gemini/gemini-cli"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-[var(--glass-bg-hover)] transition-colors group"
                    >
                      <Github className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-[var(--accent)]" />
                      <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--accent)]">Gemini CLI</span>
                      <ExternalLink className="w-3 h-3 text-[var(--text-tertiary)] ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                    <a
                      href="https://github.com/openai/codex"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-[var(--glass-bg-hover)] transition-colors group"
                    >
                      <Github className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-[var(--accent)]" />
                      <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--accent)]">Codex CLI</span>
                      <ExternalLink className="w-3 h-3 text-[var(--text-tertiary)] ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Prompt Libraries */}
              <div className="relative external-resource-dropdown">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPromptLibsOpen(!promptLibsOpen);
                    setCliReposOpen(false);
                    setAgentTemplatesOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-subtle border border-[var(--glass-border)] hover:border-[var(--accent)] transition-colors text-xs"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span className="font-semibold text-[var(--text-secondary)]">Libraries</span>
                  <ChevronDown className={cn(
                    "w-3 h-3 text-[var(--text-tertiary)] transition-transform",
                    promptLibsOpen && "rotate-180"
                  )} />
                </button>
                <AnimatePresence>
                  {promptLibsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-2 z-[100] w-64 dropdown-solid rounded-[var(--radius-md)] p-2 shadow-xl border border-[var(--glass-border)]"
                    >
                    <a
                      href="https://prompts.chat/prompts"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-[var(--glass-bg-hover)] transition-colors group"
                    >
                      <Library className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-[var(--accent)]" />
                      <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--accent)]">Prompts.chat</span>
                      <ExternalLink className="w-3 h-3 text-[var(--text-tertiary)] ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                    <a
                      href="https://prompthero.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-[var(--glass-bg-hover)] transition-colors group"
                    >
                      <Sparkles className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-[var(--accent)]" />
                      <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--accent)]">PromptHero</span>
                      <ExternalLink className="w-3 h-3 text-[var(--text-tertiary)] ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                    <a
                      href="https://cloud.google.com/vertex-ai/generative-ai/docs/prompt-gallery"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-[var(--glass-bg-hover)] transition-colors group"
                    >
                      <Library className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-[var(--accent)]" />
                      <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--accent)]">Vertex AI Gallery</span>
                      <ExternalLink className="w-3 h-3 text-[var(--text-tertiary)] ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                    <a
                      href="https://workmind.ai/ai-prompt-library/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-[var(--glass-bg-hover)] transition-colors group"
                    >
                      <Library className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-[var(--accent)]" />
                      <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--accent)]">WorkMind</span>
                      <ExternalLink className="w-3 h-3 text-[var(--text-tertiary)] ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                    <a
                      href="https://www.promptingguide.ai/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-[var(--glass-bg-hover)] transition-colors group"
                    >
                      <BookOpen className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-[var(--accent)]" />
                      <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--accent)]">Prompting Guide</span>
                      <ExternalLink className="w-3 h-3 text-[var(--text-tertiary)] ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Agent Templates */}
              <div className="relative external-resource-dropdown">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setAgentTemplatesOpen(!agentTemplatesOpen);
                    setCliReposOpen(false);
                    setPromptLibsOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-subtle border border-[var(--glass-border)] hover:border-[var(--accent)] transition-colors text-xs"
                >
                  <Bot className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span className="font-semibold text-[var(--text-secondary)]">Agents</span>
                  <ChevronDown className={cn(
                    "w-3 h-3 text-[var(--text-tertiary)] transition-transform",
                    agentTemplatesOpen && "rotate-180"
                  )} />
                </button>
                <AnimatePresence>
                  {agentTemplatesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-2 z-[100] w-64 dropdown-solid rounded-[var(--radius-md)] p-2 shadow-xl border border-[var(--glass-border)]"
                    >
                    <a
                      href="https://www.aitmpl.com/agents"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-[var(--glass-bg-hover)] transition-colors group"
                    >
                      <Bot className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-[var(--accent)]" />
                      <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--accent)]">AI Template</span>
                      <ExternalLink className="w-3 h-3 text-[var(--text-tertiary)] ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                    <a
                      href="https://github.com/ashishpatel26/500-AI-Agents-Projects"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-[var(--glass-bg-hover)] transition-colors group"
                    >
                      <Github className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-[var(--accent)]" />
                      <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--accent)]">500 AI Agents</span>
                      <ExternalLink className="w-3 h-3 text-[var(--text-tertiary)] ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                    <a
                      href="https://github.com/e2b-dev/awesome-ai-agents"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-[var(--glass-bg-hover)] transition-colors group"
                    >
                      <Github className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-[var(--accent)]" />
                      <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--accent)]">Awesome AI Agents</span>
                      <ExternalLink className="w-3 h-3 text-[var(--text-tertiary)] ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                    <a
                      href="https://huggingface.co/spaces?sort=trending&search=agent"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-[var(--glass-bg-hover)] transition-colors group"
                    >
                      <Bot className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-[var(--accent)]" />
                      <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--accent)]">HuggingFace Agents</span>
                      <ExternalLink className="w-3 h-3 text-[var(--text-tertiary)] ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-6">
          {/* Hero Section */}
          {!selectedPrompt && !selectedSubcategory && (
            <div className="py-8 md:py-12 mb-8">
              <div className="max-w-4xl">
                <h1 className="heading-display text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-3">
                  {activeTab === 'my-prompts' ? 'My Prompts' : 
                   activeTab === 'collections' ? 'Collections' : 
                   activeTab === 'system-prompts' ? 'System Prompts' : 
                   'Agent Guides'}
                </h1>
                
                {/* Attribution */}
                <p className="text-sm text-[var(--text-tertiary)] mb-6">
                  Built on the{' '}
                  <a
                    href="https://ax-platform.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1"
                  >
                    aX Platform
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
                
                {/* Search Bar */}
                <div className="relative max-w-2xl">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Search className="w-5 h-5 text-[var(--text-tertiary)]" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search prompts by title, content, tags, or category..."
                    className="w-full pl-12 pr-4 py-3.5 rounded-[var(--radius-lg)] bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-glow-subtle)] transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Breadcrumbs */}
          {(selectedPrompt || selectedSubcategory) && (
            <div className="mb-4 mt-4 flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
              <button
                onClick={handleShowAllPrompts}
                className="flex items-center gap-1 hover:text-[var(--accent)] transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>{activeTab === 'my-prompts' ? 'My Prompts' : activeTab === 'collections' ? 'Collections' : activeTab === 'system-prompts' ? 'System Prompts' : 'Agent Guides'}</span>
              </button>
              {selectedSubcategory && (
                <>
                  <BreadcrumbArrow className="w-3.5 h-3.5" />
                  <button
                    onClick={() => {
                      setSelectedSubcategory(null);
                      setShowAllPrompts(false);
                    }}
                    className="hover:text-[var(--accent)] transition-colors"
                  >
                    {selectedSubcategory.category.replace(/_/g, ' ')}
                  </button>
                  {selectedSubcategory.subcategory !== 'ALL' && (
                    <>
                      <BreadcrumbArrow className="w-3.5 h-3.5" />
                      <span>{selectedSubcategory.subcategory.replace(/_/g, ' ')}</span>
                    </>
                  )}
                </>
              )}
              {selectedPrompt && (
                <>
                  <BreadcrumbArrow className="w-3.5 h-3.5" />
                  {selectedPrompt.category && (
                    <>
                      <span>{selectedPrompt.category.replace(/_/g, ' ')}</span>
                      <BreadcrumbArrow className="w-3.5 h-3.5" />
                    </>
                  )}
                  <span className="text-[var(--text-primary)] font-medium">{selectedPrompt.title}</span>
                </>
              )}
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* All Prompts Grid */}
            {showAllPrompts ? (
              <motion.div
                key="all-prompts"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div>
                      <h2 className="heading-display text-xl font-bold tracking-tight text-[var(--text-primary)]">
                        {activeTab === 'my-prompts' ? 'My Prompts' : 
                         activeTab === 'collections' ? 'Collections' : 
                         activeTab === 'system-prompts' ? 'System Prompts' : 
                         'Agent Guides'}
                      </h2>
                      <p className="label mt-2">{sortedPrompts.length} prompts</p>
                    </div>
                    
                    {/* Stat badges - Moved here from top bar */}
                    <div className="flex items-center gap-2">
                      <div className="glass rounded-[var(--radius-sm)] px-3 py-1.5 text-center">
                        <span className="text-sm font-bold text-[var(--accent)]">{sectionPrompts.length}</span>
                        <span className="text-xs text-[var(--text-tertiary)] ml-1">Total</span>
                      </div>
                      <div className="glass rounded-[var(--radius-sm)] px-3 py-1.5 text-center">
                        <span className="text-sm font-bold text-[var(--text-primary)]">{Object.keys(categories).length}</span>
                        <span className="text-xs text-[var(--text-tertiary)] ml-1">Categories</span>
                      </div>
                    </div>

                    {/* Filter Buttons - Moved from toolbar */}
                    {(favoritePrompts.length > 0 || recentlyViewedPrompts.length > 0 || allTags.length > 0) && (
                      <div className="flex flex-wrap gap-2">
                        {/* Favorites */}
                        {favoritePrompts.length > 0 && (
                          <div className="relative filter-dropdown">
                            <button
                              onClick={() => setFavoritesExpanded(!favoritesExpanded)}
                              className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-subtle border border-[var(--glass-border)] hover:border-[var(--accent)] transition-colors text-xs"
                            >
                              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                              <span className="font-semibold text-[var(--text-secondary)]">Favorites</span>
                              <span className="font-bold text-[var(--accent)]">({favoritePrompts.length})</span>
                              {favoritesExpanded ? (
                                <ChevronDown className="w-3 h-3 text-[var(--text-tertiary)]" />
                              ) : (
                                <ChevronRight className="w-3 h-3 text-[var(--text-tertiary)]" />
                              )}
                            </button>
                            {favoritesExpanded && (
                              <div className="absolute top-full left-0 mt-2 z-50 w-72 dropdown-solid rounded-[var(--radius-md)] p-3 shadow-xl border border-[var(--glass-border)]">
                                <div className="space-y-1 max-h-80 overflow-y-auto custom-scrollbar">
                                  {favoritePrompts.map(prompt => (
                                    <button
                                      key={prompt.id}
                                      onClick={() => {
                                        handlePromptClick(prompt);
                                        setFavoritesExpanded(false);
                                      }}
                                      className="w-full text-left px-3 py-2 rounded-md hover:bg-[var(--glass-bg-hover)] transition-colors group"
                                    >
                                      <p className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] truncate">
                                        {prompt.title}
                                      </p>
                                      <p className="text-xs text-[var(--text-tertiary)] truncate mt-0.5">
                                        {prompt.category?.replace(/_/g, ' ')}
                                      </p>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Recently Viewed */}
                        {recentlyViewedPrompts.length > 0 && (
                          <div className="relative filter-dropdown">
                            <button
                              onClick={() => setRecentlyViewedExpanded(!recentlyViewedExpanded)}
                              className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-subtle border border-[var(--glass-border)] hover:border-[var(--accent)] transition-colors text-xs"
                            >
                              <Clock className="w-3 h-3 text-[var(--accent)]" />
                              <span className="font-semibold text-[var(--text-secondary)]">Recent</span>
                              <span className="font-bold text-[var(--accent)]">({recentlyViewedPrompts.length})</span>
                              {recentlyViewedExpanded ? (
                                <ChevronDown className="w-3 h-3 text-[var(--text-tertiary)]" />
                              ) : (
                                <ChevronRight className="w-3 h-3 text-[var(--text-tertiary)]" />
                              )}
                            </button>
                            {recentlyViewedExpanded && (
                              <div className="absolute top-full left-0 mt-2 z-50 w-72 dropdown-solid rounded-[var(--radius-md)] p-3 shadow-xl border border-[var(--glass-border)]">
                                <div className="space-y-1 max-h-80 overflow-y-auto custom-scrollbar">
                                  {recentlyViewedPrompts.map(prompt => (
                                    <button
                                      key={prompt.id}
                                      onClick={() => {
                                        handlePromptClick(prompt);
                                        setRecentlyViewedExpanded(false);
                                      }}
                                      className="w-full text-left px-3 py-2 rounded-md hover:bg-[var(--glass-bg-hover)] transition-colors group"
                                    >
                                      <p className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] truncate">
                                        {prompt.title}
                                      </p>
                                      <p className="text-xs text-[var(--text-tertiary)] truncate mt-0.5">
                                        {prompt.category?.replace(/_/g, ' ')}
                                      </p>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Tag Filter */}
                        {allTags.length > 0 && (
                          <div className="relative filter-dropdown">
                            <button
                              onClick={() => setTagsExpanded(!tagsExpanded)}
                              className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-subtle border border-[var(--glass-border)] hover:border-[var(--accent)] transition-colors text-xs"
                            >
                              <Tag className="w-3 h-3 text-[var(--text-tertiary)]" />
                              <span className="font-semibold text-[var(--text-secondary)]">Tags</span>
                              {selectedTags.length > 0 && (
                                <span className="font-bold text-[var(--accent)]">({selectedTags.length})</span>
                              )}
                              {tagsExpanded ? (
                                <ChevronDown className="w-3 h-3 text-[var(--text-tertiary)]" />
                              ) : (
                                <ChevronRight className="w-3 h-3 text-[var(--text-tertiary)]" />
                              )}
                            </button>
                            {tagsExpanded && (
                              <div className="absolute top-full left-0 mt-2 z-50 w-96 dropdown-solid rounded-[var(--radius-md)] p-4 shadow-xl border border-[var(--glass-border)]">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase">Select Tags</span>
                                  {selectedTags.length > 0 && (
                                    <button
                                      onClick={() => setSelectedTags([])}
                                      className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                                    >
                                      Clear All
                                    </button>
                                  )}
                                </div>
                                <div className="flex flex-wrap gap-2 max-h-80 overflow-y-auto custom-scrollbar">
                                  {allTags.map(tag => (
                                    <button
                                      key={tag}
                                      onClick={() => handleTagToggle(tag)}
                                      className={cn(
                                        "px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-colors",
                                        selectedTags.includes(tag)
                                          ? "bg-[var(--accent)] text-white shadow-[0_2px_12px_var(--accent-glow)]"
                                          : "bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-tertiary)] hover:bg-[var(--glass-bg-hover)] hover:text-[var(--text-primary)]"
                                      )}
                                    >
                                      {tag}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value as typeof sortOption)}
                      className="py-2 pl-3 pr-8 rounded-[var(--radius-sm)] bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[0.75rem] font-medium tracking-wider uppercase text-[var(--text-secondary)] cursor-pointer appearance-none transition-all duration-300 hover:border-[var(--accent)] focus:outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-glow-subtle)]"
                    >
                      <option value="title-asc">Title (A-Z)</option>
                      <option value="title-desc">Title (Z-A)</option>
                      <option value="modified-desc">Newest</option>
                      <option value="modified-asc">Oldest</option>
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] pointer-events-none" />
                  </div>
                </div>

                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="glass-card rounded-[var(--radius-lg)] p-6 animate-pulse">
                        <div className="h-4 bg-[var(--glass-bg)] rounded w-3/4 mb-4"></div>
                        <div className="h-3 bg-[var(--glass-bg)] rounded w-1/2 mb-6"></div>
                        <div className="space-y-2">
                          <div className="h-2 bg-[var(--glass-bg)] rounded"></div>
                          <div className="h-2 bg-[var(--glass-bg)] rounded w-5/6"></div>
                          <div className="h-2 bg-[var(--glass-bg)] rounded w-4/6"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : sortedPrompts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Sparkles className="w-16 h-16 text-[var(--text-tertiary)] mb-4" />
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No prompts found</h3>
                    <p className="text-[var(--text-tertiary)] mb-6 max-w-md">
                      {searchQuery ? `No prompts match "${searchQuery}". Try a different search term.` : 'Get started by creating your first prompt!'}
                    </p>
                    {!searchQuery && (
                      <button
                        onClick={handleNewPrompt}
                        className="px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent-secondary)] text-white rounded-lg font-semibold transition-colors"
                      >
                        Create Your First Prompt
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {sortedPrompts.map((prompt, i) => (
                      <PromptCard key={prompt.id} prompt={prompt} index={i} />
                    ))}
                  </div>
                )}
              </motion.div>

            ) : selectedSubcategory && subcategoryPrompts.length > 0 ? (
              /* Subcategory Grid */
              <motion.div
                key={`subcat-${selectedSubcategory.category}-${selectedSubcategory.subcategory}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full"
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full"
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
                    <div className="flex gap-2 flex-wrap justify-end">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCopyToMyPrompts(selectedPrompt)}
                        disabled={copyingToMyPromptsId === selectedPrompt.id || selectedPrompt.section === 'My_Prompts'}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-sm)] text-[0.7rem] font-semibold tracking-wider uppercase transition-all duration-300 border shrink-0 disabled:cursor-not-allowed disabled:opacity-60",
                          selectedPrompt.section === 'My_Prompts'
                            ? "bg-blue-500/15 border-blue-500/35 text-blue-300"
                            : "glass border-[var(--glass-border)] hover:border-[var(--accent)] hover:shadow-[0_0_24px_var(--accent-glow-subtle)]"
                        )}
                        title={selectedPrompt.section === 'My_Prompts' ? 'Already in My Prompts' : 'Copy this prompt to My Prompts'}
                      >
                        <FolderPlus className="w-3.5 h-3.5" />
                        {selectedPrompt.section === 'My_Prompts'
                          ? 'In My Prompts'
                          : copyingToMyPromptsId === selectedPrompt.id
                            ? 'Saving...'
                            : 'Save to My Prompts'}
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          const fullContent = `---
title: "${selectedPrompt.title}"
tags: [${selectedPrompt.tags.map(t => `"${t}"`).join(', ')}]
category: "${selectedPrompt.category}"
subcategory: "${selectedPrompt.subcategory || selectedPrompt.category}"
---

${selectedPrompt.content}`;
                          handleCopy(fullContent, `${selectedPrompt.id}-full`);
                        }}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-sm)] text-[0.7rem] font-semibold tracking-wider uppercase transition-all duration-300 border shrink-0",
                          copied === `${selectedPrompt.id}-full`
                            ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                            : "glass border-[var(--glass-border)] hover:border-[var(--accent)] hover:shadow-[0_0_24px_var(--accent-glow-subtle)]"
                        )}
                        title="Copy with frontmatter"
                      >
                        {copied === `${selectedPrompt.id}-full` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        Copy All
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCopy(selectedPrompt.content, selectedPrompt.id)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-sm)] text-[0.7rem] font-semibold tracking-wider uppercase transition-all duration-300 border shrink-0",
                          copied === selectedPrompt.id
                            ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                            : "glass border-[var(--glass-border)] hover:border-[var(--accent)] hover:shadow-[0_0_24px_var(--accent-glow-subtle)]"
                        )}
                        title="Copy content only"
                      >
                        {copied === selectedPrompt.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        Copy
                      </motion.button>
                    </div>
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
                      <Markdown remarkPlugins={[remarkGfm]}>{selectedPrompt.content}</Markdown>
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

      {/* Floating Action Button */}
      <button
        onClick={handleNewPrompt}
        className="fixed bottom-8 right-8 w-16 h-16 bg-[var(--accent)] hover:bg-[var(--accent-secondary)] text-white rounded-full shadow-lg hover:shadow-[0_0_40px_var(--accent-glow)] transition-all duration-300 flex items-center justify-center z-40 group"
        title="Create new prompt"
      >
        <Plus className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {/* Prompt Editor Modal */}
      <PromptEditorModal
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingPrompt(null);
        }}
        onSave={handleSavePrompt}
        editingPrompt={editingPrompt}
        defaultSection={activeSection}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={closeToast} />
    </div>
  );
}
