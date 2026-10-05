/**
 * Small presentational building blocks shared across the UI. They are thin
 * wrappers over the `.btn` / `.icon-btn` / `.chip` / `.kbd` classes in
 * index.css so every call site gets the same sizes, states and motion.
 */

import { forwardRef, useEffect, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { m } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn';

type ButtonVariant = 'primary' | 'tonal' | 'outline' | 'ghost' | 'danger';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md';
  icon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'outline', size = 'md', icon, className, children, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn('btn', `btn-${variant}`, size === 'sm' && 'btn-sm', className)}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
});

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required: icon buttons have no visible text. Doubles as the tooltip. */
  label: string;
  framed?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, framed, className, children, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      className={cn('icon-btn', framed && 'icon-btn-framed', className)}
      {...rest}
    >
      {children}
    </button>
  );
});

export function Chip({
  active,
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button type="button" className={cn('chip', active && 'chip-active', className)} {...rest}>
      {children}
    </button>
  );
}

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('chip', className)}>{children}</span>;
}

export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="kbd">{children}</kbd>;
}

/** The ⌘ / Ctrl prefix for shortcut hints, picked once per page. */
export const MOD_KEY =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl';

/* ----- Modal shell ----- */

const MODAL_SIZES = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-5xl',
} as const;

export interface ModalProps {
  onClose: () => void;
  size?: keyof typeof MODAL_SIZES;
  labelledBy?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Backdrop + dialog frame with the spring-in used by every dialog in the app.
 * Mount it only while open (the callers lazy-load the dialog chunk anyway), so
 * there is no `open` prop. Escape closes.
 */
export function Modal({ onClose, size = 'md', labelledBy, children, className }: ModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <m.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        initial={{ opacity: 0, scale: 0.96, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 420, damping: 34, mass: 0.8 }}
        className={cn(
          'popover relative flex w-full max-h-[90vh] flex-col overflow-hidden',
          MODAL_SIZES[size],
          className,
        )}
      >
        {children}
      </m.div>
    </div>
  );
}

export function ModalHeader({
  id,
  title,
  eyebrow,
  description,
  onClose,
}: {
  id?: string;
  title: string;
  eyebrow?: string;
  description?: string;
  onClose: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[var(--line)] px-6 py-5">
      <div className="min-w-0">
        {eyebrow && <p className="eyebrow mb-1.5">{eyebrow}</p>}
        <h2 id={id} className="text-lg font-semibold tracking-tight text-[var(--fg)]">
          {title}
        </h2>
        {description && <p className="mt-1 text-sm text-[var(--fg-3)]">{description}</p>}
      </div>
      <IconButton label="Close" onClick={onClose} className="-mr-2 -mt-1 shrink-0">
        <X className="h-4 w-4" />
      </IconButton>
    </div>
  );
}

export function ModalFooter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-2 border-t border-[var(--line)] px-6 py-4',
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ----- Inline notice (form errors) ----- */

export function Notice({
  tone = 'danger',
  children,
}: {
  tone?: 'danger' | 'info' | 'warn';
  children: ReactNode;
}) {
  const color = tone === 'danger' ? 'var(--danger)' : tone === 'warn' ? 'var(--warn)' : 'var(--accent)';
  return (
    <m.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      role={tone === 'danger' ? 'alert' : 'status'}
      className="flex items-start gap-2.5 rounded-[var(--r-md)] px-3.5 py-3 text-sm"
      style={{
        color: `color-mix(in srgb, ${color} 85%, #fff)`,
        background: `color-mix(in srgb, ${color} 10%, transparent)`,
        border: `1px solid color-mix(in srgb, ${color} 30%, transparent)`,
      }}
    >
      {children}
    </m.div>
  );
}
