/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import {
  FileText,
  LayoutGrid,
  Sparkles,
  ArrowLeft,
  Plus,
  Home,
  ChevronRight as BreadcrumbArrow,
  Share2,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ToastContainer, type ToastProps } from './components/Toast';
import { useAuth } from './contexts/AuthContext';
import { type Prompt } from './components/PromptCard';
import Sidebar, { type Theme, type SkillPackSummary } from './components/Sidebar';
import TopBar from './components/TopBar';
import LibraryHero from './components/LibraryHero';
import PromptGrid, { PromptCardGrid, type PromptCardActions } from './components/PromptGrid';
import PromptListToolbar from './components/PromptListToolbar';
import { usePromptFilters } from './hooks/usePromptFilters';

// Split out of the entry chunk: none of these render on first paint, and
// PromptDetail/PromptEditorModal each pull in react-markdown + remark-gfm.
// The three modals are only mounted while open, so opening one is what
// fetches its chunk — mounting them closed would defeat the split.
const SkillPacksView = lazy(() => import('./components/SkillPacksView'));
const PromptDetail = lazy(() => import('./components/PromptDetail'));
const PromptEditorModal = lazy(() => import('./components/PromptEditorModal'));
const LoginModal = lazy(() => import('./components/LoginModal'));
const SignupModal = lazy(() => import('./components/SignupModal'));

const chunkSpinner = (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

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
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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
    // 'skill-packs' was missing here while the popstate handler below has it,
    // so in-app navigation worked but a deep link or a refresh landed on
    // Prompts instead.
    if (section === 'skill-packs') return 'skill-packs';
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
      activeTab === 'skill-packs' ? 'skill-packs' :
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

  const activeSection = getSectionFolder(activeTab) || '4_Prompts';

  const {
    searchQuery,
    setSearchQuery,
    debouncedSearch,
    selectedTags,
    handleTagToggle,
    clearTags,
    sortOption,
    setSortOption,
    currentPage,
    totalPages,
    goToPreviousPage,
    goToNextPage,
    sectionPrompts,
    categories,
    allTags,
    sortedPrompts,
    paginatedPrompts,
  } = usePromptFilters({
    prompts,
    activeSection,
    activeTab,
    activeCategory,
    activeSubcategory,
    selectedPrompt,
    libraryMode,
  });

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

  /** Card-level props shared by the featured, all-prompts and subcategory grids. */
  const promptCardActions: PromptCardActions = useMemo(() => ({
    libraryMode,
    copyingToMyPromptsId,
    favorites,
    copied,
    onPromptClick: handlePromptClick,
    onCopyToMyPrompts: handleCopyToMyPrompts,
    onToggleFavorite: toggleFavorite,
    onEditPrompt: handleEditPrompt,
    onDeletePrompt: handleDeletePrompt,
    onDownloadMarkdown: handleDownloadMarkdown,
    onCopy: handleCopy,
  }), [
    libraryMode,
    copyingToMyPromptsId,
    favorites,
    copied,
    handlePromptClick,
    handleCopyToMyPrompts,
    toggleFavorite,
    handleEditPrompt,
    handleDeletePrompt,
    handleDownloadMarkdown,
    handleCopy,
  ]);

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
        {/* Top Bar: mobile menu trigger, resources nav, auth controls */}
        <TopBar
          user={user}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onLogin={() => setIsLoginOpen(true)}
          onSignup={() => setIsSignupOpen(true)}
          onLogout={logout}
        />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-6">
          {/* Hero Section */}
          {!selectedPrompt && !selectedSubcategory && (
            <LibraryHero
              title={getSectionDisplayName(activeTab)}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
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
                <PromptListToolbar
                  title={getSectionDisplayName(activeTab)}
                  totalCount={sortedPrompts.length}
                  sectionCount={sectionPrompts.length}
                  categoryCount={Object.keys(categories).length}
                  favoritePrompts={favoritePrompts}
                  recentlyViewedPrompts={recentlyViewedPrompts}
                  onPromptSelect={handlePromptClick}
                  allTags={allTags}
                  selectedTags={selectedTags}
                  onTagToggle={handleTagToggle}
                  onClearTags={clearTags}
                  sortOption={sortOption}
                  onSortChange={setSortOption}
                />

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
                    <PromptCardGrid
                      prompts={featuredPrompts}
                      actions={promptCardActions}
                      columns="featured"
                    />
                  </motion.div>
                )}

                {/* Skill Packs View */}
                {activeTab === 'skill-packs' && (
                  <Suspense fallback={chunkSpinner}>
                    <SkillPacksView
                      user={user}
                      libraryMode={libraryMode}
                      onRequireLogin={() => setIsLoginOpen(true)}
                      onToast={showToast}
                    />
                  </Suspense>
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

                {activeTab !== 'skill-packs' && (
                  <PromptGrid
                    isLoading={isLoading}
                    prompts={paginatedPrompts}
                    totalCount={sortedPrompts.length}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPreviousPage={goToPreviousPage}
                    onNextPage={goToNextPage}
                    searchQuery={searchQuery}
                    isAuthenticated={Boolean(user)}
                    onLogin={() => setIsLoginOpen(true)}
                    onSignup={() => setIsSignupOpen(true)}
                    onBrowsePublic={() => setLibraryMode('public')}
                    actions={promptCardActions}
                  />
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

                <PromptCardGrid prompts={subcategoryPrompts} actions={promptCardActions} />
              </motion.div>

            ) : selectedPrompt ? (
              /* Single Prompt Detail */
              <Suspense fallback={chunkSpinner}>
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
              </Suspense>

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
      {isEditorOpen && (
        <Suspense fallback={null}>
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
        </Suspense>
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={closeToast} />

      {/* Auth Modals */}
      {isLoginOpen && (
        <Suspense fallback={null}>
          <LoginModal
            isOpen={isLoginOpen}
            onClose={() => setIsLoginOpen(false)}
            onSwitchToSignup={() => {
              setIsLoginOpen(false);
              setIsSignupOpen(true);
            }}
          />
        </Suspense>
      )}

      {isSignupOpen && (
        <Suspense fallback={null}>
          <SignupModal
            isOpen={isSignupOpen}
            onClose={() => setIsSignupOpen(false)}
            onSwitchToLogin={() => {
              setIsSignupOpen(false);
              setIsLoginOpen(true);
            }}
          />
        </Suspense>
      )}
    </div>
  );
}
