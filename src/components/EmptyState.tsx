import { motion } from 'motion/react';
import { Library, Sparkles, Copy, Plus } from 'lucide-react';

interface EmptyStateProps {
  type: 'not-authenticated' | 'no-prompts';
  onLogin?: () => void;
  onSignup?: () => void;
  onBrowsePublic?: () => void;
}

export default function EmptyState({ type, onLogin, onSignup, onBrowsePublic }: EmptyStateProps) {
  if (type === 'not-authenticated') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 text-center max-w-2xl mx-auto"
      >
        {/* Icon */}
        <div className="relative mb-8">
          <div className="w-32 h-32 rounded-full border-2 border-dashed border-[var(--glass-border)] flex items-center justify-center animate-[spin_30s_linear_infinite]">
            <Library className="w-14 h-14 text-[var(--text-tertiary)]" />
          </div>
          <div className="absolute inset-0 rounded-full bg-[var(--accent-glow-subtle)] blur-[60px] pointer-events-none" />
        </div>

        {/* Title */}
        <h2 className="heading-display text-3xl font-bold text-[var(--text-primary)] mb-4">
          Sign In Required
        </h2>

        {/* Description */}
        <p className="text-base text-[var(--text-tertiary)] mb-8 max-w-md leading-relaxed">
          Create an account or sign in to build your personal prompt library. 
          Save prompts from the public library and create your own custom prompts.
        </p>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={onSignup}
            className="px-6 py-3 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-secondary)] text-white font-semibold transition-all shadow-[0_4px_20px_var(--accent-glow)] hover:shadow-[0_6px_28px_var(--accent-glow)]"
          >
            Create Account
          </button>
          <button
            onClick={onLogin}
            className="px-6 py-3 rounded-lg glass-subtle border border-[var(--glass-border)] hover:border-[var(--accent)] text-[var(--text-primary)] font-semibold transition-all"
          >
            Sign In
          </button>
        </div>

        {/* Secondary action */}
        <button
          onClick={onBrowsePublic}
          className="mt-6 flex items-center gap-2 text-sm text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          Browse Public Library Instead
        </button>
      </motion.div>
    );
  }

  // No prompts in My Library
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center max-w-2xl mx-auto"
    >
      {/* Icon */}
      <div className="relative mb-8">
        <div className="w-32 h-32 rounded-full glass-card border-2 border-[var(--glass-border)] flex items-center justify-center">
          <Library className="w-14 h-14 text-[var(--text-tertiary)]" />
        </div>
        <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-[var(--accent)] flex items-center justify-center shadow-[0_4px_20px_var(--accent-glow)]">
          <Plus className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Title */}
      <h2 className="heading-display text-3xl font-bold text-[var(--text-primary)] mb-4">
        Your Library is Empty
      </h2>

      {/* Description */}
      <p className="text-base text-[var(--text-tertiary)] mb-8 max-w-md leading-relaxed">
        Start building your personal prompt collection! Browse the public library and copy prompts you like, 
        or create your own from scratch.
      </p>

      {/* Steps */}
      <div className="w-full max-w-lg mb-8">
        <div className="glass rounded-[var(--radius-lg)] p-6 space-y-4">
          <div className="flex items-start gap-4 text-left">
            <div className="w-8 h-8 rounded-full bg-[var(--accent-glow-subtle)] border border-[var(--accent)]/50 flex items-center justify-center shrink-0">
              <Copy className="w-4 h-4 text-[var(--accent)]" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text-primary)] mb-1">Copy from Public Library</h3>
              <p className="text-sm text-[var(--text-tertiary)]">
                Browse the public library and click "Copy to My Library" on any prompt
              </p>
            </div>
          </div>

          <div className="h-px bg-[var(--glass-border)]" />

          <div className="flex items-start gap-4 text-left">
            <div className="w-8 h-8 rounded-full bg-[var(--accent-glow-subtle)] border border-[var(--accent)]/50 flex items-center justify-center shrink-0">
              <Plus className="w-4 h-4 text-[var(--accent)]" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text-primary)] mb-1">Create Your Own</h3>
              <p className="text-sm text-[var(--text-tertiary)]">
                Click the + button in the bottom right to create a custom prompt
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action */}
      <button
        onClick={onBrowsePublic}
        className="px-6 py-3 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-secondary)] text-white font-semibold transition-all shadow-[0_4px_20px_var(--accent-glow)] hover:shadow-[0_6px_28px_var(--accent-glow)]"
      >
        <span className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Browse Public Library
        </span>
      </button>
    </motion.div>
  );
}
