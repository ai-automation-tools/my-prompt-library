/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ArrowLeft,
  Download,
  Share2,
  Check,
  FolderPlus,
  Trash2,
  Copy,
  Tag,
  FolderOpen,
  Layers,
  Clock,
  LayoutGrid,
  Library
} from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Prompt } from './PromptCard';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PromptDetailProps {
  prompt: Prompt;
  libraryMode: 'public' | 'my';
  copyingToMyPromptsId?: string | null;
  copiedShareLink?: boolean;
  copied?: string | null;
  onBack: () => void;
  onDownloadMarkdown: (prompt: Prompt) => void;
  onCopyShareLink: (prompt: Prompt) => void;
  onCopyToMyPrompts: (prompt: Prompt) => void;
  onDeletePrompt: (promptId: string) => void;
  onCopy: (content: string, promptId: string) => void;
  onSubcategoryClick: (category: string, subcategory: string | 'ALL') => void;
  onShowAllPrompts: () => void;
}

export default function PromptDetail({
  prompt,
  libraryMode,
  copyingToMyPromptsId,
  copiedShareLink,
  copied,
  onBack,
  onDownloadMarkdown,
  onCopyShareLink,
  onCopyToMyPrompts,
  onDeletePrompt,
  onCopy,
  onSubcategoryClick,
  onShowAllPrompts
}: PromptDetailProps) {
  return (
    <motion.div
      key={`prompt-${prompt.id}`}
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
            onClick={onBack}
            className="p-2.5 rounded-[var(--radius-sm)] glass border-[var(--glass-border)] hover:border-[var(--accent)] transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-[var(--text-secondary)]" />
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="heading-display text-xl font-bold tracking-tight text-[var(--text-primary)] truncate">
              {prompt.title}
            </h2>
            <p className="label mt-0.5 truncate">{prompt.id}</p>
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            {/* Download Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onDownloadMarkdown(prompt)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-sm)] text-[0.7rem] font-semibold tracking-wider uppercase transition-all duration-300 border shrink-0 glass border-[var(--glass-border)] hover:border-[var(--accent)] hover:shadow-[0_0_24px_var(--accent-glow-subtle)]"
              title="Download as Markdown"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </motion.button>

            {/* Share Button (Email) */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const subject = encodeURIComponent(`Prompt: ${prompt.title}`);
                const body = encodeURIComponent(`---\ntitle: ${prompt.title}\ncategory: ${prompt.category}\ntags: ${prompt.tags.join(', ')}\n---\n\n${prompt.content}`);
                window.location.href = `mailto:?subject=${subject}&body=${body}`;
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-sm)] text-[0.7rem] font-semibold tracking-wider uppercase transition-all duration-300 border shrink-0 glass border-[var(--glass-border)] hover:border-[var(--accent)] hover:shadow-[0_0_24px_var(--accent-glow-subtle)]"
              title="Share via Email"
            >
              <Share2 className="w-3.5 h-3.5" />
              Email
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onCopyShareLink(prompt)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-sm)] text-[0.7rem] font-semibold tracking-wider uppercase transition-all duration-300 border shrink-0 glass border-[var(--glass-border)] hover:border-[var(--accent)] hover:shadow-[0_0_24px_var(--accent-glow-subtle)]"
              title="Copy direct link"
            >
              {copiedShareLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              {copiedShareLink ? 'Link Copied' : 'Copy Link'}
            </motion.button>

            {/* Only show "Save to My Prompts" button if in Public Library */}
            {libraryMode === 'public' && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => onCopyToMyPrompts(prompt)}
                disabled={copyingToMyPromptsId === prompt.id}
                className="flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-sm)] text-[0.7rem] font-semibold tracking-wider uppercase transition-all duration-300 border shrink-0 glass border-[var(--glass-border)] hover:border-[var(--accent)] hover:shadow-[0_0_24px_var(--accent-glow-subtle)]"
                title="Copy this prompt to My Library"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                {copyingToMyPromptsId === prompt.id ? 'Saving...' : 'Save to My Library'}
              </motion.button>
            )}

            {/* Only show "Remove from My Library" button if in My Library */}
            {libraryMode === 'my' && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => onDeletePrompt(prompt.id)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-sm)] text-[0.7rem] font-semibold tracking-wider uppercase transition-all duration-300 border shrink-0 bg-red-500/10 border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white"
                title="Remove this prompt from My Library"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove from My Library
              </motion.button>
            )}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onCopy(prompt.content, prompt.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-sm)] text-[0.7rem] font-semibold tracking-wider uppercase transition-all duration-300 border shrink-0",
                copied === prompt.id
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                  : "glass border-[var(--glass-border)] hover:border-[var(--accent)] hover:shadow-[0_0_24px_var(--accent-glow-subtle)]"
              )}
              title="Copy prompt content"
            >
              {copied === prompt.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              Copy
            </motion.button>
          </div>
        </div>

        {/* Content card */}
        <div className="glass-card rounded-[var(--radius-xl)] p-8 md:p-10 relative overflow-hidden">
          {/* Tags */}
          {prompt.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {prompt.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[0.65rem] font-semibold tracking-wider uppercase text-[var(--text-tertiary)]">
                  <Tag className="w-2.5 h-2.5" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="markdown-body prose prose-invert max-w-none">
            <Markdown remarkPlugins={[remarkGfm]}>{prompt.content}</Markdown>
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
              { label: 'Category', value: prompt.category.replace(/_/g, ' '), icon: FolderOpen },
              { label: 'Subcategory', value: prompt.subcategory?.replace(/_/g, ' ') || 'None', icon: Layers },
              { label: 'Modified', value: new Date(prompt.lastModified).toLocaleDateString(), icon: Clock },
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
                if (prompt.subcategory) {
                  onSubcategoryClick(prompt.category, prompt.subcategory);
                }
              }}
              className="flex flex-col items-center justify-center gap-2.5 p-5 rounded-[var(--radius-md)] bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-[var(--accent)] hover:bg-[var(--accent-glow-subtle)] transition-all duration-300 group"
            >
              <LayoutGrid className="w-4.5 h-4.5 text-[var(--text-tertiary)] group-hover:text-[var(--accent)] transition-colors" />
              <span className="text-[0.6rem] font-semibold tracking-wider uppercase text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)] transition-colors">Grid View</span>
            </button>
            <button
              onClick={onShowAllPrompts}
              className="flex flex-col items-center justify-center gap-2.5 p-5 rounded-[var(--radius-md)] bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-[var(--accent)] hover:bg-[var(--accent-glow-subtle)] transition-all duration-300 group"
            >
              <Library className="w-4.5 h-4.5 text-[var(--text-tertiary)] group-hover:text-[var(--accent)] transition-colors" />
              <span className="text-[0.6rem] font-semibold tracking-wider uppercase text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)] transition-colors">Library</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
