/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { ArrowLeft, Check, LayoutGrid, Link2, Plus, Sparkles } from 'lucide-react';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'motion/react';
import { ToastContainer, type ToastProps } from './components/Toast';
import { useAuth } from './contexts/AuthContext';
import { type Prompt } from './components/PromptCard';
import Sidebar, { type SkillPackSummary } from './components/Sidebar';
import TopBar, { type Crumb } from './components/TopBar';
import LibraryHero from './components/LibraryHero';
import AmbientBackground from './components/AmbientBackground';
import PromptGrid, { PromptCardGrid, type PromptCardActions } from './components/PromptGrid';
import PromptListToolbar from './components/PromptListToolbar';
import { Button } from './components/ui/primitives';
import { usePromptFilters } from './hooks/usePromptFilters';
import { usePromptContent } from './hooks/usePromptContent';
import { useLibraryRoute, slugifyPromptPath, type LibraryTab } from './hooks/useLibraryRoute';
import { getSection, getSectionFolder, getSectionDisplayName, getTabForFolder, humanize } from './lib/sections';
import { readStoredTheme, THEME_STORAGE_KEY, type Theme } from './lib/themes';

// Split out of the entry chunk: none of these render on first paint, and
// PromptDetail/PromptEditorModal each pull in react-markdown + remark-gfm.
// The modals and the palette are only mounted while open, so opening one is
// what fetches its chunk — mounting them closed would defeat the split.
const SkillPacksView = lazy(() => import('./components/SkillPacksView'));
const PromptDetail = lazy(() => import('./components/PromptDetail'));
const PromptEditorModal = lazy(() => import('./components/PromptEditorModal'));
const LoginModal = lazy(() => import('./components/LoginModal'));
const SignupModal = lazy(() => import('./components/SignupModal'));
const CommandPalette = lazy(() => import('./components/CommandPalette'));

const chunkSpinner = (
  <div className="flex h-64 items-center justify-center">
    <div className="spinner" />
  </div>
);

const PUBLIC_SHARE_ORIGIN = 'https://prompts.mikesailab.com';

export default function App() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState<{category: string, subcategory: string | 'ALL'} | null>(null);
  const [showAllPrompts, setShowAllPrompts] = useState(true);
  const [theme, setTheme] = useState<Theme>(readStoredTheme);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  // Open on desktop, closed (a drawer) on phones.
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth >= 768);
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const [copyingToMyPromptsId, setCopyingToMyPromptsId] = useState<string | null>(null);
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

  // Copy-button state plus the "go get the real body" helpers the card actions
  // need, since a listing prompt carries only a blurb. See usePromptContent.
  const { copied, copyContent, copyPrompt, fetchFullContent } = usePromptContent(showToast);

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

  // Section / category / subcategory / ?prompt= — seeded from and written back to the URL.
  const {
    activeTab,
    setActiveTab,
    activeCategory,
    setActiveCategory,
    activeSubcategory,
    setActiveSubcategory,
    promptPathParam,
    setPromptPathParam,
  } = useLibraryRoute({ selectedPrompt, setSelectedPrompt, setLibraryMode });

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
    if (libraryMode === 'my' && !user) {
      setSkillPacks([]);
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
  }, [activeTab, libraryMode, user]);

  // Theme: applied to <html> (themes.css keys off it) and remembered. The
  // inline script in index.html reads the same key before first paint.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      /* storage unavailable */
    }
  }, [theme]);

  // Section accent: themes.css maps data-section → --section-c.
  const section = getSection(activeTab);
  useEffect(() => {
    document.documentElement.setAttribute('data-section', section.slug);
  }, [section.slug]);

  // ⌘K / Ctrl+K opens the command palette from anywhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsPaletteOpen(open => !open);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

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

  /** Prompt count per section, for the sidebar badges. */
  const sectionCounts = useMemo(() => {
    const counts: Partial<Record<LibraryTab, number>> = {};
    for (const p of prompts) {
      const tab = getTabForFolder(p.section);
      counts[tab] = (counts[tab] ?? 0) + 1;
    }
    if (activeTab === 'skill-packs') counts['skill-packs'] = skillPacks.length;
    return counts;
  }, [prompts, skillPacks.length, activeTab]);

  const heroStats = useMemo(() => {
    if (activeTab === 'skill-packs') {
      return [
        { label: 'Packs', value: skillPacks.length },
        { label: 'Categories', value: new Set(skillPacks.map(p => p.category)).size },
        { label: 'Skills', value: skillPacks.reduce((n, p) => n + p.skillCount, 0) },
      ];
    }
    return [
      { label: 'Prompts', value: sectionPrompts.length },
      { label: 'Categories', value: Object.keys(categories).length },
      { label: 'Tags', value: allTags.length },
    ];
  }, [activeTab, skillPacks, sectionPrompts.length, categories, allTags.length]);

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
    if (window.innerWidth < 768) setIsSidebarOpen(false);
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

  const handleCopyShareLink = useCallback(async (prompt: Prompt) => {
    if (prompt.isUserOwned) {
      showToast('info', 'Direct links are only available for public library items');
      return;
    }

    const shareUrl = new URL(PUBLIC_SHARE_ORIGIN);
    shareUrl.searchParams.set('library', 'public');
    shareUrl.searchParams.set('prompt', slugifyPromptPath(prompt.id));
    shareUrl.searchParams.set('section', getTabForFolder(prompt.section));
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
    shareUrl.searchParams.set('section', getSection(activeTab).id);
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
      const nextTab = getTabForFolder(matchingPrompt.section);

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
      const content = frontmatter + (await fetchFullContent(prompt));
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
  }, [showToast, fetchFullContent]);

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

  const handleEditPrompt = useCallback(async (prompt: Prompt) => {
    // Seeding the editor from the listing copy would load the 200-character
    // preview and save it back over the real prompt.
    setEditingPrompt({ ...prompt, content: await fetchFullContent(prompt) });
    setIsEditorOpen(true);
  }, [fetchFullContent]);

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

  /** Palette → prompt: switch library/section to wherever it lives, then open it. */
  const openPromptFromPalette = useCallback((prompt: Prompt) => {
    if (prompt.isUserOwned) {
      if (libraryMode !== 'my') setLibraryMode('my');
    } else {
      if (libraryMode !== 'public') setLibraryMode('public');
      const tab = getTabForFolder(prompt.section);
      if (tab !== activeTab) setActiveTab(tab);
    }
    void handlePromptClick(prompt);
  }, [libraryMode, activeTab, handlePromptClick]);

  const openSectionFromPalette = useCallback((tab: LibraryTab) => {
    setActiveTab(tab);
    handleShowAllPrompts();
  }, [handleShowAllPrompts]);

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
    onCopy: copyPrompt,
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
    copyPrompt,
  ]);

  /** Breadcrumb trail for the top bar: library › section › category › subcategory › prompt. */
  const crumbs = useMemo<Crumb[]>(() => {
    const trail: Crumb[] = [
      { label: libraryMode === 'my' ? 'My Library' : 'Public Library', onClick: handleShowAllPrompts },
      { label: getSectionDisplayName(activeTab), onClick: handleShowAllPrompts },
    ];
    if (selectedSubcategory) {
      trail.push({ label: humanize(selectedSubcategory.category), onClick: () => handleSubcategoryClick(selectedSubcategory.category, 'ALL') });
      if (selectedSubcategory.subcategory !== 'ALL') trail.push({ label: humanize(selectedSubcategory.subcategory) });
    } else if (selectedPrompt) {
      if (selectedPrompt.category) {
        trail.push({ label: humanize(selectedPrompt.category), onClick: () => handleSubcategoryClick(selectedPrompt.category, 'ALL') });
      }
      trail.push({ label: selectedPrompt.title });
    }
    return trail;
  }, [libraryMode, activeTab, selectedSubcategory, selectedPrompt, handleShowAllPrompts, handleSubcategoryClick]);

  const showFeatured =
    activeTab !== 'skill-packs' && libraryMode === 'public' && !debouncedSearch && selectedTags.length === 0 && featuredPrompts.length > 0;

  return (
    <LazyMotion features={domAnimation} strict>
    <div className="relative flex h-screen overflow-hidden">
      <AmbientBackground />

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
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
        sectionCounts={sectionCounts}
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
      <main className="relative z-10 flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        <TopBar
          user={user}
          sidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(open => !open)}
          crumbs={crumbs}
          onOpenPalette={() => setIsPaletteOpen(true)}
          onNewPrompt={handleNewPrompt}
          onLogin={() => setIsLoginOpen(true)}
          onSignup={() => setIsSignupOpen(true)}
          onLogout={logout}
        />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-4 pb-24 md:px-8 md:pb-12">
          <div className="mx-auto w-full max-w-[1440px]">
          {/* Hero Section */}
          {!selectedPrompt && !selectedSubcategory && (
            <LibraryHero
              section={section}
              libraryMode={libraryMode}
              stats={heroStats}
              searchQuery={searchQuery}
              onSearchChange={activeTab === 'skill-packs' ? undefined : setSearchQuery}
            />
          )}

          <AnimatePresence mode="wait">
            {/* All Prompts Grid */}
            {showAllPrompts ? (
              <m.div
                key={`all-${activeTab}-${libraryMode}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
                className="w-full"
              >
                {activeTab !== 'skill-packs' && (
                  <PromptListToolbar
                    totalCount={sortedPrompts.length}
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
                )}

                {/* Featured Section */}
                {showFeatured && (
                  <m.section
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.05 }}
                    className="mb-9"
                    aria-labelledby="featured-heading"
                  >
                    <div className="mb-3.5 flex items-center gap-2.5">
                      <span className="glyph h-7 w-7 rounded-[7px]">
                        <Sparkles className="h-3.5 w-3.5" />
                      </span>
                      <h2 id="featured-heading" className="text-[15px] font-semibold tracking-tight text-[var(--fg)]">
                        Featured
                      </h2>
                      <span className="eyebrow ml-1 hidden sm:inline">Picked and favourites</span>
                    </div>
                    <PromptCardGrid prompts={featuredPrompts} actions={promptCardActions} columns="featured" />
                  </m.section>
                )}

                {/* Skill Packs View */}
                {activeTab === 'skill-packs' && (
                  <Suspense fallback={chunkSpinner}>
                    <SkillPacksView
                      user={user}
                      libraryMode={libraryMode}
                      onRequireLogin={() => setIsLoginOpen(true)}
                      onBrowsePublic={() => setLibraryMode('public')}
                      onToast={showToast}
                    />
                  </Suspense>
                )}

                {/* All Prompts Section Header */}
                {showFeatured && (
                  <div className="mb-3.5 flex items-center gap-2.5">
                    <span className="grid h-7 w-7 place-items-center rounded-[7px] border border-[var(--line)] bg-[var(--surface)] text-[var(--fg-3)]">
                      <LayoutGrid className="h-3.5 w-3.5" />
                    </span>
                    <h2 className="text-[15px] font-semibold tracking-tight text-[var(--fg)]">
                      All {getSectionDisplayName(activeTab).toLowerCase()}
                    </h2>
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
              </m.div>

            ) : selectedSubcategory && subcategoryPrompts.length > 0 ? (
              /* Subcategory Grid */
              <m.div
                key={`subcat-${selectedSubcategory.category}-${selectedSubcategory.subcategory}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
                className="w-full pt-6"
              >
                <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <button type="button" onClick={handleShowAllPrompts} className="icon-btn icon-btn-framed mt-0.5 h-9 w-9 shrink-0" aria-label="Back to all">
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <div className="min-w-0">
                      <p className="eyebrow mb-1.5">{getSectionDisplayName(activeTab)}</p>
                      <h1 className="text-[1.5rem] font-semibold leading-tight tracking-[-0.02em] text-[var(--fg)] md:text-[1.85rem]">
                        {humanize(selectedSubcategory.category)}
                        {selectedSubcategory.subcategory !== 'ALL' && (
                          <>
                            <span className="mx-2 text-[var(--fg-5)]">/</span>
                            <span className="text-[var(--c)]">{humanize(selectedSubcategory.subcategory)}</span>
                          </>
                        )}
                      </h1>
                      <p className="mono mt-1.5 text-[11px] text-[var(--fg-4)]">
                        {subcategoryPrompts.length.toLocaleString()} {subcategoryPrompts.length === 1 ? 'prompt' : 'prompts'}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleCopySubsectionLink(selectedSubcategory.category, selectedSubcategory.subcategory)}
                    icon={copiedShareLink ? <Check className="h-3.5 w-3.5 text-[var(--ok)]" /> : <Link2 className="h-3.5 w-3.5" />}
                  >
                    {copiedShareLink ? 'Link copied' : 'Copy section link'}
                  </Button>
                </div>

                <PromptCardGrid prompts={subcategoryPrompts} actions={promptCardActions} />
              </m.div>

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
                  onCopy={copyContent}
                  onSubcategoryClick={handleSubcategoryClick}
                  onShowAllPrompts={handleShowAllPrompts}
                />
              </Suspense>

            ) : (
              /* Empty state */
              <m.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex min-h-[60vh] flex-col items-center justify-center text-center"
              >
                <span className="glyph mb-4 h-12 w-12 rounded-[12px]">
                  <LayoutGrid className="h-5 w-5" />
                </span>
                <p className="text-lg font-semibold text-[var(--fg)]">Nothing here</p>
                <p className="mt-1.5 max-w-sm text-[14px] text-[var(--fg-3)]">
                  This category has no prompts in the current library. Pick another one from the sidebar.
                </p>
                <Button size="sm" className="mt-5" onClick={handleShowAllPrompts}>
                  Back to all {getSectionDisplayName(activeTab).toLowerCase()}
                </Button>
              </m.div>
            )}
          </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Floating "new prompt" — phones only; the top bar carries it elsewhere. */}
      <m.button
        type="button"
        whileTap={{ scale: 0.94 }}
        onClick={handleNewPrompt}
        className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[var(--accent)] text-[var(--accent-ink)] shadow-[0_12px_32px_-8px_var(--glow)] sm:hidden"
        aria-label="New prompt"
      >
        <Plus className="h-6 w-6" />
      </m.button>

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

      {/* Command palette */}
      {isPaletteOpen && (
        <Suspense fallback={null}>
          <CommandPalette
            prompts={prompts}
            recentPrompts={recentlyViewedPrompts}
            onClose={() => setIsPaletteOpen(false)}
            onSelectPrompt={openPromptFromPalette}
            onSelectSection={openSectionFromPalette}
            onNewPrompt={handleNewPrompt}
            onSetTheme={setTheme}
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
    </LazyMotion>
  );
}
