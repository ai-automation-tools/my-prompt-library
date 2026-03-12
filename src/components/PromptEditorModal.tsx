/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { X, Save, Eye, Code } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'motion/react';

interface Prompt {
  id?: string;
  title: string;
  section: string;
  category: string;
  subcategory: string | null;
  tags: string[];
  content: string;
}

interface PromptEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (prompt: Prompt) => Promise<void>;
  editingPrompt?: Prompt | null;
  defaultSection?: string;
}

export default function PromptEditorModal({
  isOpen,
  onClose,
  onSave,
  editingPrompt,
  defaultSection = 'My_Prompts'
}: PromptEditorModalProps) {
  const [title, setTitle] = useState('');
  const [section, setSection] = useState(defaultSection);
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [content, setContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Populate form when editing
  useEffect(() => {
    if (editingPrompt) {
      setTitle(editingPrompt.title);
      setSection(editingPrompt.section);
      setCategory(editingPrompt.category);
      setSubcategory(editingPrompt.subcategory || '');
      setTags(editingPrompt.tags || []);
      setContent(editingPrompt.content);
    } else {
      // Reset form for new prompt
      setTitle('');
      setSection(defaultSection);
      setCategory('');
      setSubcategory('');
      setTags([]);
      setTagInput('');
      setContent('');
    }
    setError('');
  }, [editingPrompt, defaultSection, isOpen]);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!category.trim()) {
      setError('Category is required');
      return;
    }
    if (!content.trim()) {
      setError('Content is required');
      return;
    }

    setSaving(true);

    try {
      await onSave({
        id: editingPrompt?.id,
        title: title.trim(),
        section,
        category: category.trim(),
        subcategory: subcategory.trim() || null,
        tags,
        content: content.trim()
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save prompt');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl max-h-[90vh] bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-[var(--radius-lg)] shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[var(--glass-border)]">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
              {editingPrompt ? 'Edit Prompt' : 'Create New Prompt'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[var(--glass-bg-hover)] transition-colors"
            >
              <X className="w-5 h-5 text-[var(--text-tertiary)]" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                    placeholder="Enter prompt title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">
                    Section *
                  </label>
                  <select
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                    disabled={!!editingPrompt}
                  >
                    <option value="My_Prompts">My Prompts</option>
                    <option value="Collections">Collections</option>
                    <option value="System_Prompts">System Prompts</option>
                    <option value="Agent_Guides">Agent Guides</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">
                    Category *
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                    placeholder="e.g., IT, Business, Writing"
                    disabled={!!editingPrompt}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">
                    Subcategory
                  </label>
                  <input
                    type="text"
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                    placeholder="Optional subcategory"
                    disabled={!!editingPrompt}
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--accent-glow-subtle)] text-[var(--accent)] rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-[var(--accent-secondary)]"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="w-full px-4 py-2.5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                  placeholder="Type and press Enter to add tags"
                />
              </div>

              {/* Content Editor/Preview Toggle */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-[var(--text-secondary)]">
                    Content * (Markdown)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-hover)] border border-[var(--glass-border)] rounded-lg text-[var(--text-secondary)] transition-colors"
                  >
                    {showPreview ? (
                      <>
                        <Code className="w-4 h-4" />
                        Edit
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        Preview
                      </>
                    )}
                  </button>
                </div>

                {showPreview ? (
                  <div className="min-h-[400px] p-4 bg-[var(--bg-tertiary)] border border-[var(--glass-border)] rounded-lg overflow-auto">
                    <div className="markdown-body prose prose-invert max-w-none">
                      <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
                    </div>
                  </div>
                ) : (
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full min-h-[400px] px-4 py-3 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg text-[var(--text-primary)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors resize-y"
                    placeholder="Write your prompt content here in Markdown..."
                    required
                  />
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-[var(--glass-border)]">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--glass-bg-hover)] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-[var(--accent)] hover:bg-[var(--accent-secondary)] text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : (editingPrompt ? 'Update' : 'Create')}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
