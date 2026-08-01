/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memo } from 'react';
import {
  FileText,
  Copy,
  Check,
  Star,
  Edit,
  Trash2,
  Download,
  FolderPlus
} from 'lucide-react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Prompt {
  id: string;
  title: string;
  section: string;
  category: string;
  subcategory: string | null;
  tags: string[];
  content: string;
  lastModified: string;
  featured?: boolean;
  isUserOwned?: boolean;
  anchor?: string;
}

export function extractEmoji(text: string): { emoji: string | null; title: string } {
  const emojiRegex = /^([\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])/u;
  const match = text.match(emojiRegex);
  
  if (match) {
    return {
      emoji: match[1],
      title: text.slice(match[1].length).trim()
    };
  }
  
  return {
    emoji: null,
    title: text
  };
}

interface PromptCardProps {
  prompt: Prompt;
  index: number;
  libraryMode: 'public' | 'my';
  copyingToMyPromptsId?: string | null;
  favorites?: string[];
  copied?: string | null;
  onPromptClick: (prompt: Prompt) => void;
  onCopyToMyPrompts: (prompt: Prompt) => void;
  onToggleFavorite?: (promptId: string, e?: React.MouseEvent) => void;
  onEditPrompt?: (prompt: Prompt) => void;
  onDeletePrompt?: (promptId: string) => void;
  onDownloadMarkdown: (prompt: Prompt) => void;
  onCopy: (content: string, promptId: string) => void;
}

const PromptCard = memo(function PromptCard({
  prompt,
  index,
  libraryMode,
  copyingToMyPromptsId,
  favorites = [],
  copied,
  onPromptClick,
  onCopyToMyPrompts,
  onToggleFavorite,
  onEditPrompt,
  onDeletePrompt,
  onDownloadMarkdown,
  onCopy
}: PromptCardProps) {
  const isFavorite = favorites.includes(prompt.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.01, 0.3), ease: [0.4, 0, 0.2, 1] }}
      key={prompt.id}
      className="glass-card rounded-[var(--radius-lg)] relative group cursor-pointer overflow-hidden"
      onClick={() => onPromptClick(prompt)}
    >
      {/* Hover glow accent */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-[var(--accent-glow-subtle)] blur-[60px]" />
      </div>

      {/* Action buttons at bottom-right */}
      <div className="absolute bottom-3 right-3 z-20 flex gap-2">
        {libraryMode === 'public' ? (
          // Public Library: Show Add to My Library button
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCopyToMyPrompts(prompt);
            }}
            disabled={copyingToMyPromptsId === prompt.id}
            className={cn(
              "p-2 rounded-[var(--radius-sm)] transition-all duration-300 border backdrop-blur-sm",
              copyingToMyPromptsId === prompt.id
                ? "bg-[var(--accent)]/20 border-[var(--accent)]/50 text-[var(--accent)] cursor-wait"
                : "bg-[var(--glass-bg)] text-[var(--text-tertiary)] border-[var(--glass-border)] hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)] hover:shadow-[0_0_24px_var(--accent-glow)]"
            )}
            title="Add to My Library"
          >
            <FolderPlus className="w-3.5 h-3.5" />
          </button>
        ) : (
          // My Library: Show favorite, edit, and delete buttons
          <>
            {onToggleFavorite && (
              <button
                onClick={(e) => onToggleFavorite(prompt.id, e)}
                className={cn(
                  "p-2 rounded-[var(--radius-sm)] bg-[var(--glass-bg)] transition-all duration-300 border backdrop-blur-sm",
                  isFavorite
                    ? "text-yellow-400 border-yellow-400/50 hover:bg-yellow-400/20"
                    : "text-[var(--text-tertiary)] border-[var(--glass-border)] hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)]"
                )}
                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Star className={cn("w-3.5 h-3.5", isFavorite && "fill-yellow-400")} />
              </button>
            )}
            {onEditPrompt && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditPrompt(prompt);
                }}
                className="p-2 rounded-[var(--radius-sm)] bg-[var(--glass-bg)] hover:bg-[var(--accent)] text-[var(--text-tertiary)] hover:text-white transition-all duration-300 border border-[var(--glass-border)] hover:border-[var(--accent)] hover:shadow-[0_0_24px_var(--accent-glow)] backdrop-blur-sm"
                title="Edit prompt"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
            )}
            {onDeletePrompt && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeletePrompt(prompt.id);
                }}
                className="p-2 rounded-[var(--radius-sm)] bg-[var(--glass-bg)] hover:bg-red-500 text-[var(--text-tertiary)] hover:text-white transition-all duration-300 border border-[var(--glass-border)] hover:border-red-500 backdrop-blur-sm"
                title="Remove from My Library"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDownloadMarkdown(prompt);
          }}
          className="p-2 rounded-[var(--radius-sm)] bg-[var(--glass-bg)] hover:bg-[var(--accent)] text-[var(--text-tertiary)] hover:text-white transition-all duration-300 border border-[var(--glass-border)] hover:border-[var(--accent)] hover:shadow-[0_0_24px_var(--accent-glow)] backdrop-blur-sm"
          title="Download as Markdown"
        >
          <Download className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCopy(prompt.content, prompt.id);
          }}
          className={cn(
            "p-2 rounded-[var(--radius-sm)] transition-all duration-300 border backdrop-blur-sm",
            copied === prompt.id
              ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
              : "bg-[var(--glass-bg)] text-[var(--text-tertiary)] border-[var(--glass-border)] hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)]"
          )}
          title="Copy content"
        >
          {copied === prompt.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Main content area */}
      <div className="p-6 pb-14 space-y-4 relative z-[1]">
        <div className="flex items-start gap-3.5">
          {(() => {
            const { emoji, title } = extractEmoji(prompt.title);
            return (
              <>
                <div className="w-9 h-9 rounded-[var(--radius-sm)] bg-[var(--accent-glow-subtle)] flex items-center justify-center shrink-0 border border-[var(--glass-border)]">
                  {emoji ? (
                    <span className="text-lg">{emoji}</span>
                  ) : (
                    <FileText className="w-4 h-4 text-[var(--accent)]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="heading-display text-base font-bold tracking-tight leading-snug mb-1.5 text-[var(--text-primary)]">
                    {title}
                  </h3>
                  <p className="label truncate">
                    {prompt.category}{prompt.subcategory ? ` / ${prompt.subcategory.replace(/_/g, ' ')}` : ''}
                  </p>
                </div>
              </>
            );
          })()}
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
});

export default PromptCard;
