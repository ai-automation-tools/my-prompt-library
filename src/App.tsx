/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Copy, 
  Check, 
  Search, 
  Menu, 
  X, 
  Palette,
  Terminal,
  BookOpen,
  FileText,
  Hash,
  LayoutGrid,
  Library
} from 'lucide-react';
import Markdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
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

type Theme = 'light' | 'retro-wave' | 'emerald-glass' | 'obsidian-cyan' | 'carbon-ember' | 'midnight-violet' | 'oled-mono' | 'deep-sea' | 'abyss-black' | 'terminal-hacker' | 'github-dark-pro';

const THEMES: { id: Theme; name: string; icon: string }[] = [
  { id: 'retro-wave', name: 'Retro Wave', icon: '⚡' },
  { id: 'obsidian-cyan', name: 'Obsidian Cyan', icon: '💎' },
  { id: 'carbon-ember', name: 'Carbon Ember', icon: '🔥' },
  { id: 'midnight-violet', name: 'Midnight Violet', icon: '🌙' },
  { id: 'emerald-glass', name: 'Emerald Glass', icon: '🌿' },
  { id: 'deep-sea', name: 'Deep Sea', icon: '🌊' },
  { id: 'terminal-hacker', name: 'Terminal Hacker', icon: '💻' },
  { id: 'github-dark-pro', name: 'GitHub Dark Pro', icon: '🐙' },
  { id: 'oled-mono', name: 'OLED Mono', icon: '⬛' },
  { id: 'abyss-black', name: 'Abyss Black', icon: '🕳️' },
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
  const [showAllPrompts, setShowAllPrompts] = useState(false);
  const [theme, setTheme] = useState<Theme>('retro-wave');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'collections'>('all');

  useEffect(() => {
    fetch('/api/prompts')
      .then(res => res.json())
      .then(data => {
        setPrompts(data);
        if (data.length > 0) setSelectedPrompt(data[0]);
      })
      .catch(err => console.error('Failed to fetch prompts:', err));
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

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
      // Show all prompts from the category
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

  const handleCopy = (content: string, promptId: string) => {
    navigator.clipboard.writeText(content);
    setCopied(promptId);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans selection:bg-pink-500 selection:text-white">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-500 ease-out md:relative md:translate-x-0",
          !isSidebarOpen && "-translate-x-full md:hidden"
        )}
      >
        <div className="flex flex-col h-full glass m-4 rounded-3xl overflow-hidden border-white/10">
          <div className="p-8">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-6">Categories</h2>
            
            <div className="space-y-3 mb-8">
              <button 
                onClick={handleShowAllPrompts}
                className={cn(
                  "w-full py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                  showAllPrompts 
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.4)]" 
                    : "border border-white/10 hover:bg-white/5 opacity-60"
                )}
              >
                All Prompts
              </button>
              <button 
                onClick={() => setActiveTab('collections')}
                className={cn(
                  "w-full py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                  activeTab === 'collections' 
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.4)]" 
                    : "border border-white/10 hover:bg-white/5 opacity-60"
                )}
              >
                Collections
              </button>
            </div>

            <div className="space-y-2">
              {FIXED_CATEGORIES.map(cat => (
                <div key={cat} className="space-y-1">
                  <button 
                    onClick={() => toggleCategory(cat)}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-300 group",
                      expandedCategories[cat] 
                        ? "border-pink-500/50 bg-pink-500/5" 
                        : "border-white/5 hover:border-white/20 hover:bg-white/5"
                    )}
                  >
                    <span className={cn(
                      "text-sm font-bold tracking-tight transition-colors",
                      expandedCategories[cat] ? "text-pink-500" : "text-white/70 group-hover:text-white"
                    )}>
                      {cat}
                    </span>
                    {expandedCategories[cat] ? (
                      <ChevronDown className="w-4 h-4 text-pink-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 opacity-30 group-hover:opacity-100" />
                    )}
                  </button>

                  {expandedCategories[cat] && (
                    <div className="mt-2 space-y-1 pl-2">
                      {/* "All" option to show all prompts in category */}
                      <button 
                        onClick={() => handleSubcategoryClick(cat, 'ALL')}
                        className={cn(
                          "w-full flex items-center justify-between px-4 py-2 rounded-lg transition-all duration-200 group",
                          selectedSubcategory?.category === cat && selectedSubcategory?.subcategory === 'ALL' 
                            ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-[0_0_15px_rgba(236,72,153,0.3)]" 
                            : "hover:bg-white/5 text-white/60 group-hover:text-white/90"
                        )}
                      >
                        <span className={cn(
                          "text-[10px] font-black uppercase tracking-widest transition-colors",
                          selectedSubcategory?.category === cat && selectedSubcategory?.subcategory === 'ALL' ? "text-white" : ""
                        )}>
                          🔹 All
                        </span>
                      </button>
                      
                      {/* Subcategories */}
                      {Array.from(categories[cat] || []).sort().map(subcat => {
                        const isSelected = selectedSubcategory?.category === cat && selectedSubcategory?.subcategory === subcat;
                        
                        return (
                          <button 
                            key={subcat}
                            onClick={() => handleSubcategoryClick(cat, subcat)}
                            className={cn(
                              "w-full flex items-center justify-between px-4 py-2 rounded-lg transition-all duration-200 group",
                              isSelected ? "bg-pink-500/10 text-pink-400" : "hover:bg-white/5 text-white/40 group-hover:text-white/80"
                            )}
                          >
                            <span className={cn(
                              "text-[10px] font-black uppercase tracking-widest transition-colors",
                              isSelected ? "text-pink-400" : ""
                            )}>
                              {subcat.replace(/_/g, ' ')}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header Section */}
        <div className="p-8 md:p-12 pb-0 shrink-0">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.3em] text-pink-500 uppercase">
                <div className="w-1 h-1 rounded-full bg-pink-500 animate-pulse" />
                AI Prompt Library
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none italic uppercase">
                <span className="text-white">Prompt</span><br />
                <span className="text-pink-500 neon-text">Library</span>
              </h1>
              <p className="max-w-xl text-sm text-white/40 font-medium leading-relaxed">
                A general-purpose prompt library for multiple AI tools (chat, agents, automation, copilots). 
                Organize by category, copy fast, and iterate.
              </p>
            </div>

            <div className="flex items-center gap-6 pb-2">
              <div className="relative group">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Theme</span>
                  <button 
                    className="flex items-center gap-3 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest glass border-white/10 hover:border-pink-500/50 transition-all"
                  >
                    {THEMES.find(t => t.id === theme)?.name}
                    <ChevronDown className="w-4 h-4 opacity-40" />
                  </button>
                </div>
                <div 
                  className="absolute right-0 top-full mt-2 w-56 rounded-2xl glass border-white/10 p-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0"
                >
                  {THEMES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={cn(
                        "flex items-center gap-3 w-full px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        theme === t.id ? "bg-pink-500 text-white shadow-lg" : "hover:bg-white/5 opacity-60 hover:opacity-100"
                      )}
                    >
                      <span>{t.icon}</span>
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 pt-8">
          {/* Grid View for All Prompts */}
          {showAllPrompts ? (
            <div className="max-w-[1600px] mx-auto">
              <div className="mb-8">
                <h2 className="text-3xl font-black tracking-tight uppercase italic">
                  All Prompts
                </h2>
                <p className="text-sm text-white/40 mt-2">{filteredPrompts.length} prompts</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPrompts.map(prompt => (
                  <div 
                    key={prompt.id}
                    className="glass-card rounded-2xl p-6 relative group hover:border-pink-500/50 transition-all cursor-pointer"
                    onClick={() => handlePromptClick(prompt)}
                  >
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(prompt.content, prompt.id);
                      }}
                      className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-pink-500 text-[10px] font-black uppercase tracking-widest transition-all duration-300 border border-white/10 hover:border-pink-500 hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] z-10"
                    >
                      {copied === prompt.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </button>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-pink-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-black tracking-tight uppercase leading-tight mb-1 pr-8">
                            {prompt.title}
                          </h3>
                          <p className="text-[9px] font-black uppercase tracking-widest opacity-30 truncate">
                            {prompt.category} / {prompt.subcategory || 'General'}
                          </p>
                        </div>
                      </div>
                      
                      {prompt.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {prompt.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-widest opacity-60">
                              {tag}
                            </span>
                          ))}
                          {prompt.tags.length > 3 && (
                            <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-widest opacity-60">
                              +{prompt.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="text-xs text-white/40 line-clamp-3 font-medium">
                        {prompt.content.substring(0, 150)}...
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : selectedSubcategory && subcategoryPrompts.length > 0 ? (
            <div className="max-w-[1600px] mx-auto">
              <div className="mb-8">
                <h2 className="text-3xl font-black tracking-tight uppercase italic">
                  {selectedSubcategory.category} / {selectedSubcategory.subcategory === 'ALL' ? 'All' : selectedSubcategory.subcategory.replace(/_/g, ' ')}
                </h2>
                <p className="text-sm text-white/40 mt-2">{subcategoryPrompts.length} prompts</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subcategoryPrompts.map(prompt => (
                  <div 
                    key={prompt.id}
                    className="glass-card rounded-2xl p-6 relative group hover:border-pink-500/50 transition-all cursor-pointer"
                    onClick={() => handlePromptClick(prompt)}
                  >
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(prompt.content, prompt.id);
                      }}
                      className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-pink-500 text-[10px] font-black uppercase tracking-widest transition-all duration-300 border border-white/10 hover:border-pink-500 hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] z-10"
                    >
                      {copied === prompt.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </button>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-pink-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-black tracking-tight uppercase leading-tight mb-1 pr-8">
                            {prompt.title}
                          </h3>
                          <p className="text-[9px] font-black uppercase tracking-widest opacity-30 truncate">
                            {prompt.id}
                          </p>
                        </div>
                      </div>
                      
                      {prompt.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {prompt.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-widest opacity-60">
                              {tag}
                            </span>
                          ))}
                          {prompt.tags.length > 3 && (
                            <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-widest opacity-60">
                              +{prompt.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="text-xs text-white/40 line-clamp-3 font-medium">
                        {prompt.content.substring(0, 150)}...
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : selectedPrompt ? (
            // Single Prompt View
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-[1600px] mx-auto">
              <div className="lg:col-span-8 space-y-8">
                <div className="glass-card rounded-[2.5rem] p-8 md:p-12 relative group overflow-hidden">
                  {/* Copy Button */}
                  <button 
                    onClick={() => handleCopy(selectedPrompt.content, selectedPrompt.id)}
                    className="absolute top-8 right-8 px-4 py-2 rounded-lg bg-white/5 hover:bg-pink-500 text-[10px] font-black uppercase tracking-widest transition-all duration-300 border border-white/10 hover:border-pink-500 hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] z-10"
                  >
                    {copied === selectedPrompt.id ? <Check className="w-4 h-4 inline mr-2" /> : <Copy className="w-4 h-4 inline mr-2" />}
                    {copied === selectedPrompt.id ? 'Copied' : 'Copy'}
                  </button>

                  <div className="space-y-6 mb-12">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center">
                        <Terminal className="w-4 h-4 text-pink-500" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black tracking-tight uppercase italic">{selectedPrompt.title}</h2>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-30">{selectedPrompt.id}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {selectedPrompt.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest opacity-60">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="markdown-body prose prose-invert max-w-none">
                    <Markdown>{selectedPrompt.content}</Markdown>
                  </div>

                  {/* Decorative element */}
                  <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-pink-500/10 rounded-full blur-[100px] pointer-events-none" />
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="lg:col-span-4 space-y-6">
                <div className="glass rounded-3xl p-8 border-white/5 space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Metadata</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-white/5">
                      <span className="text-xs font-bold opacity-40">Category</span>
                      <span className="text-xs font-black uppercase tracking-widest text-pink-500">{selectedPrompt.category}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-white/5">
                      <span className="text-xs font-bold opacity-40">Subcategory</span>
                      <span className="text-xs font-black uppercase tracking-widest">{selectedPrompt.subcategory || 'None'}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-white/5">
                      <span className="text-xs font-bold opacity-40">Modified</span>
                      <span className="text-xs font-black uppercase tracking-widest">{new Date(selectedPrompt.lastModified).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-3xl p-8 border-white/5 space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => {
                        if (selectedPrompt.subcategory) {
                          handleSubcategoryClick(selectedPrompt.category, selectedPrompt.subcategory);
                        }
                      }}
                      className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-pink-500/50 hover:bg-pink-500/5 transition-all group"
                    >
                      <LayoutGrid className="w-5 h-5 opacity-40 group-hover:text-pink-500 group-hover:opacity-100" />
                      <span className="text-[9px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100">Grid View</span>
                    </button>
                    <button className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-pink-500/50 hover:bg-pink-500/5 transition-all group">
                      <Library className="w-5 h-5 opacity-40 group-hover:text-pink-500 group-hover:opacity-100" />
                      <span className="text-[9px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100">Library</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-8 opacity-20">
              <div className="w-32 h-32 rounded-full border-4 border-dashed border-white/20 flex items-center justify-center animate-[spin_20s_linear_infinite]">
                <Terminal className="w-12 h-12" />
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-black uppercase tracking-widest italic">System Ready</p>
                <p className="text-xs font-bold opacity-60">Select a category or subcategory from the sidebar to begin</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
