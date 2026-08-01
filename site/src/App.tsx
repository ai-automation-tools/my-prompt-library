/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Search,
  Menu,
  FileText,
  LayoutGrid,
  Library,
  Sparkles,
  ArrowLeft,
  Tag,
  Plus,
  Trash2,
  Star,
  Home,
  ChevronRight as BreadcrumbArrow,
  ChevronDown,
  ChevronRight,
  Share2,
  Check
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'motion/react';
import PromptEditorModal from './components/PromptEditorModal';
import LoginModal from './components/LoginModal';
import SignupModal from './components/SignupModal';
import EmptyState from './components/EmptyState';
import { ToastContainer, type ToastProps } from './components/Toast';
import { useAuth } from './contexts/AuthContext';
import SkillPacksView from './components/SkillPacksView';
import ResourcesNav from './components/ResourcesNav';
import PromptCard, { extractEmoji, type Prompt } from './components/PromptCard';
import PromptDetail from './components/PromptDetail';
import Sidebar, { type Theme, type SkillPackSummary } from './components/Sidebar';
import Fuse from 'fuse.js';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PUBLIC_SHARE_ORIGIN = 'https://prompts.mikesailab.com';

function getSectionParamForPromptSection(section: string): string {
  return section === '1_Guides'
    ? 'agent-guides'
    : section === '2_Agents'
      ? 'agents'
      : section === '3_Skills'
        ? 'skills'
        : section === '5_System_Prompts'
          ? 'system-prompts'
          : 'prompt-library';
}

function slugifyPromptPath(promptId: string): string {
  return promptId
    .replace(/\\/g, '/')
    .replace(/\.md$/i, '')
    .replace(/^library\//i, '')
    .split('/')
    .filter(Boolean)
    .join('/');
}

// Helper functions to map between tab names and folder names
const getSectionFolder = (tab: string): string => {
  switch(tab) {
    case 'guides': return '1_Guides';
    case 'agents': return '2_Agents';
    case 'skills': return '3_Skills';
    case 'prompts': return '4_Prompts';
    case 'system-prompts': return '5_System_Prompts';
    // Legacy tab names for backward compatibility
    case 'agent-guides': return '1_Guides';
    case 'prompt-library': return '4_Prompts';
    default: return '';
  }
};

const getSectionDisplayName = (tab: string): string => {
  switch(tab) {
    case 'guides':
    case 'agent-guides': return 'Guides';
    case 'agents': return 'Agents';
    case 'skills': return 'Skills';
    case 'prompts':
    case 'prompt-library': return 'Prompts';
    case 'system-prompts': return 'System Prompts';
    default: return 'Library';
  }
};

export default function App() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState<{category: string, subcategory: string | 'ALL'} | null>(null);
  const [showAllPrompts, setShowAllPrompts] = useState(true);
  const [theme, setTheme] = useState<Theme>('mikesailab');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<'title-asc' | 'title-desc' | 'modified-desc' | 'modified-asc'>('title-asc');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 50;
  const [copied, setCopied] = useState<string | null>(null);
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const [copyingToMyPromptsId, setCopyingToMyPromptsId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'agent-guides' | 'agents' | 'prompt-library' | 'skills' | 'system-prompts' | 'skill-packs'>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get('section');
    if (section === 'agent-guides') return 'agent-guides';
    if (section === 'agents') return 'agents';
    if (section === 'prompt-library') return 'prompt-library';
    if (section === 'skills') return 'skills';
    if (section === 'system-prompts') return 'system-prompts';
    return 'prompt-library';
  });
  const [activeCategory, setActiveCategory] = useState<string | null>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('category');
  });
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('subcategory');
  });
  const [promptPathParam, setPromptPathParam] = useState<string | null>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('prompt');
  });
  const [skillPacks, setSkillPacks] = useState<SkillPackSummary[]>([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  
  // Library mode: 'public' or 'my'
  const [libraryMode, setLibraryMode] = useState<'public' | 'my'>(() => {
    const saved = localStorage.getItem('library-mode');
    const urlParams = new URLSearchParams(window.location.search);
    const urlMode = urlParams.get('library');
    if (urlMode === 'public' || urlMode === 'my') return urlMode;
    return (saved === 'public' || saved === 'my') ? saved as 'public' | 'my' : 'public';
  });
  
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

  // Persist library mode to localStorage and URL
  useEffect(() => {
    localStorage.setItem('library-mode', libraryMode);
    const url = new URL(window.location.href);
    url.searchParams.set('library', libraryMode);
    window.history.replaceState({}, '', url.toString());
  }, [libraryMode]);

  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const section = urlParams.get('section');
      const library = urlParams.get('library');
      const category = urlParams.get('category');
      const subcategory = urlParams.get('subcategory');
      const prompt = urlParams.get('prompt');

      if (section === 'agent-guides') setActiveTab('agent-guides');
      else if (section === 'agents') setActiveTab('agents');
      else if (section === 'skills') setActiveTab('skills');
      else if (section === 'system-prompts') setActiveTab('system-prompts');
      else if (section === 'skill-packs') setActiveTab('skill-packs');
      else setActiveTab('prompt-library');

      if (library === 'public' || library === 'my') setLibraryMode(library);
      setActiveCategory(category);
      setActiveSubcategory(subcategory);
      setPromptPathParam(prompt);

      if (!prompt) {
        setSelectedPrompt(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update URL when navigation state changes
  useEffect(() => {
    const url = new URL(window.location.href);
    
    const sectionParam = 
      activeTab === 'agent-guides' ? 'agent-guides' :
      activeTab === 'agents' ? 'agents' :
      activeTab === 'prompt-library' ? 'prompt-library' :
      activeTab === 'skills' ? 'skills' :
      'system-prompts';
    url.searchParams.set('section', sectionParam);
    
    if (activeCategory) {
      url.searchParams.set('category', activeCategory);
    } else {
      url.searchParams.delete('category');
    }
    
    if (activeSubcategory) {
      url.searchParams.set('subcategory', activeSubcategory);
    } else {
      url.searchParams.delete('subcategory');
    }

    if (selectedPrompt && !selectedPrompt.isUserOwned) {
      url.searchParams.set('prompt', slugifyPromptPath(selectedPrompt.id));
    } else {
      url.searchParams.delete('prompt');
    }
    
    window.history.replaceState({}, '', url.toString());
  }, [activeTab, activeCategory, activeSubcategory, selectedPrompt]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, debouncedSearch, selectedTags, sortOption, activeCategory, activeSubcategory]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (libraryMode === 'my' && !user) {
      setPrompts([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const url = `/api/prompts?library=${libraryMode}&lightweight=true`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setPrompts(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch prompts:', err);
        showToast('error', 'Failed to load prompts');
        setIsLoading(false);
      });
  }, [showToast, libraryMode, authLoading, user]);

  useEffect(() => {
    if (activeTab !== 'skill-packs') {
      return;
    }

    fetch(`/api/skill-packs?library=${libraryMode}`, { credentials: 'include' })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error || 'Failed to fetch skill packs');
        }
        return data;
      })
      .then(data => setSkillPacks(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error('Failed to fetch skill packs:', err);
        setSkillPacks([]);
      });
  }, [activeTab, libraryMode]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

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

  const activeSection = getSectionFolder(activeTab) || '4_Prompts';

  const sectionPrompts = useMemo(() => {
    return prompts.filter(p => p.section === activeSection);
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
      if (Array.isArray(p.tags)) {
        p.tags.forEach(tag => tags.add(tag));
      }
    });
    return Array.from(tags).sort();
  }, [sectionPrompts]);

  const filteredPrompts = useMemo(() => {
    let currentPrompts = sectionPrompts.filter(prompt => {
      if (prompt.isUserOwned || libraryMode === 'my') {
        return true;
      }
      
      if (activeTab === 'agent-guides' && !prompt.id.startsWith('1_Guides/')) return false;
      if (activeTab === 'agents' && !prompt.id.startsWith('2_Agents/')) return false;
      if (activeTab === 'prompt-library' && !prompt.id.startsWith('4_Prompts/')) return false;
      if (activeTab === 'system-prompts' && !prompt.id.startsWith('5_System_Prompts/')) return false;
      if (activeTab === 'skills' && !prompt.id.startsWith('3_Skills/')) return false;
      return true;
    });

    if (activeCategory && !selectedPrompt) {
      currentPrompts = currentPrompts.filter(p => p.category === activeCategory);
      if (activeSubcategory) {
        currentPrompts = currentPrompts.filter(p => p.subcategory === activeSubcategory);
      }
    }

    if (selectedTags.length > 0) {
      currentPrompts = currentPrompts.filter(prompt =>
        selectedTags.every(tag => prompt.tags.includes(tag))
      );
    }

    if (!debouncedSearch) {
      return currentPrompts;
    }

    const query = debouncedSearch.trim().toLowerCase();

    const titleStartsWith = currentPrompts.filter(p => p.title.toLowerCase().startsWith(query));
    const titleContains = currentPrompts.filter(
      p => !p.title.toLowerCase().startsWith(query) && p.title.toLowerCase().includes(query)
    );
    const metadataContains = currentPrompts.filter(p => {
      if (p.title.toLowerCase().includes(query)) return false;
      const inCategory = p.category?.toLowerCase().includes(query);
      const inSubcategory = p.subcategory?.toLowerCase().includes(query);
      const inTags = Array.isArray(p.tags) && p.tags.some(tag => tag.toLowerCase().includes(query));
      return inCategory || inSubcategory || inTags;
    });

    const strictOrdered = [...titleStartsWith, ...titleContains, ...metadataContains];
    if (strictOrdered.length > 0) {
      return strictOrdered;
    }

    const fuse = new Fuse(currentPrompts, {
      keys: [
        { name: 'title', weight: 10 },
        { name: 'tags', weight: 3 },
        { name: 'category', weight: 2 },
        { name: 'subcategory', weight: 2 },
      ],
      includeScore: true,
      threshold: 0.22,
      ignoreLocation: true,
      minMatchCharLength: 3,
    });

    return fuse.search(debouncedSearch).map(result => result.item);
  }, [sectionPrompts, debouncedSearch, activeTab, selectedTags, activeCategory, activeSubcategory, selectedPrompt, libraryMode]);

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

  const paginatedPrompts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return sortedPrompts.slice(startIndex, endIndex);
  }, [sortedPrompts, currentPage, ITEMS_PER_PAGE]);

  const totalPages = useMemo(() => {
    return Math.ceil(sortedPrompts.length / ITEMS_PER_PAGE);
  }, [sortedPrompts.length, ITEMS_PER_PAGE]);

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

  const featuredPrompts = useMemo(() => {
    const featured = sectionPrompts
      .filter(p => p.tags.includes('featured') || favorites.includes(p.id))
      .slice(0, 4);
    
    if (featured.length === 0) {
      return sectionPrompts
        .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
        .slice(0, 4);
    }
    
    return featured;
  }, [sectionPrompts, favorites]);

  const favoritePrompts = useMemo(() => {
    return prompts.filter(p => favorites.includes(p.id));
  }, [prompts, favorites]);

  const recentlyViewedPrompts = useMemo(() => {
    return recentlyViewed
      .map(id => prompts.find(p => p.id === id))
      .filter((p): p is Prompt => p !== undefined);
  }, [prompts, recentlyViewed]);

  const handleSubcategoryClick = useCallback((category: string, subcategory: string | 'ALL') => {
    setSelectedSubcategory({ category, subcategory });
    setSelectedPrompt(null);
    setShowAllPrompts(false);
    
    setActiveCategory(category);
    setActiveSubcategory(subcategory === 'ALL' ? null : subcategory);
  }, []);

  const toggleCategory = useCallback((cat: string) => {
    const isExpanded = expandedCategories[cat];
    setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
    
    if (!isExpanded) {
      handleSubcategoryClick(cat, 'ALL');
    }
  }, [expandedCategories, handleSubcategoryClick]);

  const handlePromptClick = useCallback(async (prompt: Prompt) => {
    setPromptPathParam(prompt.isUserOwned ? null : slugifyPromptPath(prompt.id));
    setCopiedShareLink(false);
    let fullPrompt = prompt;
    try {
      const response = await fetch(`/api/prompts/${encodeURIComponent(prompt.id)}`);
      if (response.ok) {
        fullPrompt = await response.json();
      } else {
        console.warn('Failed to fetch full content, using cached version');
      }
    } catch (err) {
      console.error('Failed to fetch full prompt content:', err);
    }
    
    setSelectedPrompt(fullPrompt);
    setSelectedSubcategory(null);
    setShowAllPrompts(false);
    
    setActiveCategory(fullPrompt.category);
    setActiveSubcategory(null);
    
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== fullPrompt.id);
      return [fullPrompt.id, ...filtered].slice(0, 10);
    });
  }, []);

  const handleShowAllPrompts = useCallback(() => {
    setShowAllPrompts(true);
    setSelectedPrompt(null);
    setSelectedSubcategory(null);
    setActiveCategory(null);
    setActiveSubcategory(null);
    setPromptPathParam(null);
    setCopiedShareLink(false);
    const url = new URL(window.location.href);
    url.searchParams.delete('category');
    url.searchParams.delete('subcategory');
    url.searchParams.delete('prompt');
    window.history.pushState({}, '', url.toString());
  }, []);

  const handleBack = useCallback(() => {
    if (selectedPrompt) {
      setSelectedPrompt(null);
      setPromptPathParam(null);
      setCopiedShareLink(false);
      
      if (activeCategory) {
        handleSubcategoryClick(activeCategory, 'ALL');
      }
    } else if (selectedSubcategory) {
      const category = selectedSubcategory.category;
      setSelectedSubcategory(null);
      setActiveSubcategory(null);
      
      handleSubcategoryClick(category, 'ALL');
    } else if (activeCategory) {
      setActiveCategory(null);
      handleShowAllPrompts();
    } else {
      handleShowAllPrompts();
    }
  }, [selectedPrompt, selectedSubcategory, activeCategory, handleShowAllPrompts, handleSubcategoryClick]);

  const handleCopy = useCallback((content: string, promptId: string) => {
    navigator.clipboard.writeText(content);
    setCopied(promptId);
    setTimeout(() => setCopied(null), 2000);
    showToast('success', 'Copied to clipboard');
  }, [showToast]);

  const handleCopyShareLink = useCallback(async (prompt: Prompt) => {
    if (prompt.isUserOwned) {
      showToast('info', 'Direct links are only available for public library items');
      return;
    }

    const shareUrl = new URL(PUBLIC_SHARE_ORIGIN);
    shareUrl.searchParams.set('library', 'public');
    shareUrl.searchParams.set('prompt', slugifyPromptPath(prompt.id));
    shareUrl.searchParams.set('section', getSectionParamForPromptSection(prompt.section));
    shareUrl.searchParams.set('category', prompt.category);
    if (prompt.subcategory) shareUrl.searchParams.set('subcategory', prompt.subcategory);
    else shareUrl.searchParams.delete('subcategory');

    await navigator.clipboard.writeText(shareUrl.toString());
    setCopiedShareLink(true);
    setTimeout(() => setCopiedShareLink(false), 2000);
    showToast('success', 'Direct link copied');
  }, [showToast]);

  const handleCopySubsectionLink = useCallback(async (category: string, subcategory: string | 'ALL') => {
    const shareUrl = new URL(PUBLIC_SHARE_ORIGIN);
    shareUrl.searchParams.set('library', 'public');
    shareUrl.searchParams.set('section',
      activeTab === 'agent-guides' ? 'agent-guides' :
      activeTab === 'agents' ? 'agents' :
      activeTab === 'skills' ? 'skills' :
      activeTab === 'system-prompts' ? 'system-prompts' :
      'prompt-library'
    );
    shareUrl.searchParams.set('category', category);
    if (subcategory !== 'ALL') shareUrl.searchParams.set('subcategory', subcategory);
    else shareUrl.searchParams.delete('subcategory');
    shareUrl.searchParams.delete('prompt');

    await navigator.clipboard.writeText(shareUrl.toString());
    setCopiedShareLink(true);
    setTimeout(() => setCopiedShareLink(false), 2000);
    showToast('success', 'Subsection link copied');
  }, [activeTab, showToast]);

  useEffect(() => {
    if (!promptPathParam || prompts.length === 0 || selectedPrompt) {
      return;
    }

    const normalizedPromptPath = decodeURIComponent(promptPathParam)
      .replace(/^library\//, '')
      .replace(/^\/+|\/+$/g, '');
    const matchingPrompt = prompts.find(prompt => {
      if (prompt.isUserOwned) return false;
      return slugifyPromptPath(prompt.id) === normalizedPromptPath;
    });

    if (matchingPrompt) {
      const nextTab = getSectionParamForPromptSection(matchingPrompt.section) as typeof activeTab;

      if (activeTab !== nextTab) setActiveTab(nextTab);
      if (libraryMode !== 'public') setLibraryMode('public');
      if (activeCategory !== matchingPrompt.category) setActiveCategory(matchingPrompt.category);
      if (activeSubcategory !== matchingPrompt.subcategory) setActiveSubcategory(matchingPrompt.subcategory);

      void handlePromptClick(matchingPrompt);
    }
  }, [promptPathParam, prompts, selectedPrompt, activeTab, libraryMode, activeCategory, activeSubcategory, handlePromptClick]);

  const handleDownloadMarkdown = useCallback(async (prompt: Prompt) => {
    if (prompt.section === '3_Skills' && !prompt.isUserOwned) {
      try {
        const skillDirPath = prompt.id.replace(/\/SKILL\.md$/, '');
        const response = await fetch(`/api/skills/download/${encodeURIComponent(skillDirPath)}`);
        
        if (!response.ok) {
          throw new Error('Failed to download skill');
        }

        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = `${prompt.category}.zip`;
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="(.+)"/);
          if (match) filename = match[1];
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('success', 'Skill downloaded as zip!');
      } catch (error) {
        console.error('Download error:', error);
        showToast('error', 'Failed to download skill');
      }
    } else {
      const frontmatter = `---
title: ${prompt.title}
section: ${prompt.section}
category: ${prompt.category}
subcategory: ${prompt.subcategory || 'None'}
tags: ${prompt.tags.join(', ')}
created: ${prompt.lastModified}
source: My Prompt Library
---

`;
      const content = frontmatter + prompt.content;
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${prompt.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('success', prompt.section === '3_Skills' ? 'Skill downloaded as markdown!' : 'Prompt downloaded!');
    }
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

  const refreshPrompts = useCallback(async () => {
    const url = `/api/prompts?library=${libraryMode}&lightweight=true`;

    try {
      const res = await fetch(url, { credentials: 'include' });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to refresh prompts');
      }

      setPrompts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch prompts:', err);
      setPrompts([]);
    }
  }, [libraryMode]);

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
    if (!user) {
      showToast('error', 'Please sign in to create prompts');
      setIsLoginOpen(true);
      return;
    }

    if (libraryMode !== 'my') {
      setLibraryMode('my');
    }

    if (activeTab === 'skill-packs') {
      setActiveTab('prompt-library');
    }

    setEditingPrompt(null);
    setIsEditorOpen(true);
  }, [user, showToast, libraryMode, activeTab]);

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
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        libraryMode={libraryMode}
        setLibraryMode={setLibraryMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        skillPacks={skillPacks}
        categories={categories}
        sectionPrompts={sectionPrompts}
        expandedCategories={expandedCategories}
        setExpandedCategories={setExpandedCategories}
        toggleCategory={toggleCategory}
        selectedSubcategory={selectedSubcategory}
        handleSubcategoryClick={handleSubcategoryClick}
        handleShowAllPrompts={handleShowAllPrompts}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Bar with Mobile Menu and ResourcesNav */}
        <div className="shrink-0 px-4 md:px-6 py-3 border-b border-[var(--glass-border)]">
          <div className="flex items-center gap-4">
            {/* LEFT: Mobile menu */}
            <button
              onClick={() => setIsSidebarOpen(true)}
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
                    onClick={logout}
                    className="px-4 py-1.5 bg-red-900/20 hover:bg-red-800/30 text-sm font-medium text-red-300 hover:text-red-200 transition-all"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="px-4 py-1.5 rounded-lg glass-subtle border border-[var(--glass-border)] hover:border-[var(--accent)] text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setIsSignupOpen(true)}
                    className="px-4 py-1.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-secondary)] text-white text-sm font-semibold transition-colors shadow-[0_2px_12px_var(--accent-glow)]"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-6">
          {/* Hero Section */}
          {!selectedPrompt && !selectedSubcategory && (
            <div className="py-8 md:py-12 mb-8">
              <div className="max-w-4xl">
                <h1 className="heading-display text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
                  {getSectionDisplayName(activeTab)}
                </h1>

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
                <span>{getSectionDisplayName(activeTab)}</span>
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
                        {getSectionDisplayName(activeTab)}
                      </h2>
                      <p className="label mt-2">{sortedPrompts.length} prompts</p>
                    </div>
                    
                    {/* Stat badges */}
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

                    {/* Filter Buttons */}
                    {(favoritePrompts.length > 0 || recentlyViewedPrompts.length > 0 || allTags.length > 0) && (
                      <div className="flex flex-wrap gap-2">
                        {/* Favorites */}
                        {favoritePrompts.length > 0 && (
                          <div className="relative filter-dropdown">
                            <button
                              onClick={() => {
                                setFavoritesExpanded(!favoritesExpanded);
                                setRecentlyViewedExpanded(false);
                                setTagsExpanded(false);
                              }}
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
                              onClick={() => {
                                setRecentlyViewedExpanded(!recentlyViewedExpanded);
                                setFavoritesExpanded(false);
                                setTagsExpanded(false);
                              }}
                              className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-subtle border border-[var(--glass-border)] hover:border-[var(--accent)] transition-colors text-xs"
                            >
                              <FileText className="w-3 h-3 text-[var(--text-tertiary)]" />
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
                              onClick={() => {
                                setTagsExpanded(!tagsExpanded);
                                setFavoritesExpanded(false);
                                setRecentlyViewedExpanded(false);
                              }}
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

                {/* Featured Section */}
                {activeTab !== 'skill-packs' && libraryMode === 'public' && !debouncedSearch && selectedTags.length === 0 && featuredPrompts.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="mb-10"
                  >
                    <div className="flex items-center gap-3 mb-5">
                      <Sparkles className="w-5 h-5 text-[var(--accent)]" />
                      <h3 className="heading-display text-lg font-bold tracking-tight text-[var(--text-primary)]">
                        Featured Prompts
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {featuredPrompts.map((prompt, i) => (
                        <PromptCard
                          key={prompt.id}
                          prompt={prompt}
                          index={i}
                          libraryMode={libraryMode}
                          copyingToMyPromptsId={copyingToMyPromptsId}
                          favorites={favorites}
                          copied={copied}
                          onPromptClick={handlePromptClick}
                          onCopyToMyPrompts={handleCopyToMyPrompts}
                          onToggleFavorite={toggleFavorite}
                          onEditPrompt={handleEditPrompt}
                          onDeletePrompt={handleDeletePrompt}
                          onDownloadMarkdown={handleDownloadMarkdown}
                          onCopy={handleCopy}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Skill Packs View */}
                {activeTab === 'skill-packs' && (
                  <SkillPacksView
                    user={user}
                    libraryMode={libraryMode}
                    onRequireLogin={() => setIsLoginOpen(true)}
                    onToast={showToast}
                  />
                )}

                {/* All Prompts Section Header */}
                {activeTab !== 'skill-packs' && libraryMode === 'public' && !debouncedSearch && selectedTags.length === 0 && featuredPrompts.length > 0 && (
                  <div className="flex items-center gap-3 mb-5">
                    <LayoutGrid className="w-5 h-5 text-[var(--text-secondary)]" />
                    <h3 className="heading-display text-lg font-bold tracking-tight text-[var(--text-primary)]">
                      All
                    </h3>
                  </div>
                )}

                {activeTab !== 'skill-packs' && isLoading ? (
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
                ) : activeTab !== 'skill-packs' && sortedPrompts.length === 0 ? (
                  libraryMode === 'my' && !user ? (
                    <EmptyState
                      type="not-authenticated"
                      onLogin={() => setIsLoginOpen(true)}
                      onSignup={() => setIsSignupOpen(true)}
                      onBrowsePublic={() => setLibraryMode('public')}
                    />
                  ) : libraryMode === 'my' && user ? (
                    <EmptyState
                      type="no-prompts"
                      onBrowsePublic={() => setLibraryMode('public')}
                    />
                  ) : searchQuery ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <Sparkles className="w-16 h-16 text-[var(--text-tertiary)] mb-4" />
                      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No prompts found</h3>
                      <p className="text-[var(--text-tertiary)] mb-6 max-w-md">
                        No prompts match "{searchQuery}". Try a different search term.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <Sparkles className="w-16 h-16 text-[var(--text-tertiary)] mb-4" />
                      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No prompts found</h3>
                      <p className="text-[var(--text-tertiary)] mb-6 max-w-md">
                        Get started by creating your first prompt!
                      </p>
                    </div>
                  )
                ) : activeTab !== 'skill-packs' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {paginatedPrompts.map((prompt, i) => (
                        <PromptCard
                          key={prompt.id}
                          prompt={prompt}
                          index={i}
                          libraryMode={libraryMode}
                          copyingToMyPromptsId={copyingToMyPromptsId}
                          favorites={favorites}
                          copied={copied}
                          onPromptClick={handlePromptClick}
                          onCopyToMyPrompts={handleCopyToMyPrompts}
                          onToggleFavorite={toggleFavorite}
                          onEditPrompt={handleEditPrompt}
                          onDeletePrompt={handleDeletePrompt}
                          onDownloadMarkdown={handleDownloadMarkdown}
                          onCopy={handleCopy}
                        />
                      ))}
                    </div>
                    
                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-6 mt-8">
                        <button
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="px-6 py-3 rounded-[var(--radius-md)] bg-[var(--accent)] border-2 border-[var(--accent)] text-white font-bold shadow-lg hover:shadow-[0_0_24px_var(--accent-glow)] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none hover:scale-105 transition-all duration-200"
                        >
                          ← Previous
                        </button>
                        <span className="text-sm font-medium text-[var(--text-secondary)] px-4">
                          Page {currentPage} of {totalPages} <span className="text-[var(--text-tertiary)]">({sortedPrompts.length} total)</span>
                        </span>
                        <button
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="px-6 py-3 rounded-[var(--radius-md)] bg-[var(--accent)] border-2 border-[var(--accent)] text-white font-bold shadow-lg hover:shadow-[0_0_24px_var(--accent-glow)] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none hover:scale-105 transition-all duration-200"
                        >
                          Next →
                        </button>
                      </div>
                    )}
                  </>
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
                <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
                  <div className="flex items-center gap-4">
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
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCopySubsectionLink(selectedSubcategory.category, selectedSubcategory.subcategory)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-sm)] text-[0.7rem] font-semibold tracking-wider uppercase transition-all duration-300 border shrink-0 glass border-[var(--glass-border)] hover:border-[var(--accent)] hover:shadow-[0_0_24px_var(--accent-glow-subtle)]"
                    title="Copy subsection link"
                  >
                    {copiedShareLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                    {copiedShareLink ? 'Link Copied' : 'Copy Section Link'}
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {subcategoryPrompts.map((prompt, i) => (
                    <PromptCard
                      key={prompt.id}
                      prompt={prompt}
                      index={i}
                      libraryMode={libraryMode}
                      copyingToMyPromptsId={copyingToMyPromptsId}
                      favorites={favorites}
                      copied={copied}
                      onPromptClick={handlePromptClick}
                      onCopyToMyPrompts={handleCopyToMyPrompts}
                      onToggleFavorite={toggleFavorite}
                      onEditPrompt={handleEditPrompt}
                      onDeletePrompt={handleDeletePrompt}
                      onDownloadMarkdown={handleDownloadMarkdown}
                      onCopy={handleCopy}
                    />
                  ))}
                </div>
              </motion.div>

            ) : selectedPrompt ? (
              /* Single Prompt Detail */
              <PromptDetail
                prompt={selectedPrompt}
                libraryMode={libraryMode}
                copyingToMyPromptsId={copyingToMyPromptsId}
                copiedShareLink={copiedShareLink}
                copied={copied}
                onBack={handleBack}
                onDownloadMarkdown={handleDownloadMarkdown}
                onCopyShareLink={handleCopyShareLink}
                onCopyToMyPrompts={handleCopyToMyPrompts}
                onDeletePrompt={handleDeletePrompt}
                onCopy={handleCopy}
                onSubcategoryClick={handleSubcategoryClick}
                onShowAllPrompts={handleShowAllPrompts}
              />

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
                    <FileText className="w-10 h-10 text-[var(--text-tertiary)]" />
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

      {/* Auth Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToSignup={() => {
          setIsLoginOpen(false);
          setIsSignupOpen(true);
        }}
      />

      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onSwitchToLogin={() => {
          setIsSignupOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </div>
  );
}
