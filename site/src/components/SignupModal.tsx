import { useState } from 'react';
import { m } from 'motion/react';
import { AlertCircle, ArrowRight, CheckCircle2, Lock, Mail, UserRound } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button, Modal, ModalHeader, Notice } from './ui/primitives';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function SignupModal({ isOpen, onClose, onSwitchToLogin }: SignupModalProps) {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const strength = password.length >= 12 ? 3 : password.length >= 8 ? 2 : password.length > 0 ? 1 : 0;
  const strengthLabel = ['', 'Too short', 'Good', 'Strong'][strength];
  const strengthColor = ['transparent', 'var(--danger)', 'var(--warn)', 'var(--ok)'][strength];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    try {
      await signup(email, password, name || undefined);
      onClose();
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const field = 'mb-1.5 block text-[13px] font-medium text-[var(--fg-2)]';
  const iconCls = 'pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fg-4)]';

  return (
    <Modal onClose={onClose} size="sm" labelledBy="signup-title">
      <ModalHeader id="signup-title" eyebrow="Account" title="Create your account" description="A personal library for saved and authored prompts." onClose={onClose} />

      <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
        {error && (
          <Notice>
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </Notice>
        )}

        <div>
          <label htmlFor="name" className={field}>
            Name <span className="font-normal text-[var(--fg-4)]">(optional)</span>
          </label>
          <div className="relative">
            <UserRound className={iconCls} />
            <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ada Lovelace" autoComplete="name" autoFocus className="input pl-10" />
          </div>
        </div>

        <div>
          <label htmlFor="signup-email" className={field}>
            Email
          </label>
          <div className="relative">
            <Mail className={iconCls} />
            <input id="signup-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required className="input pl-10" />
          </div>
        </div>

        <div>
          <label htmlFor="signup-password" className={field}>
            Password
          </label>
          <div className="relative">
            <Lock className={iconCls} />
            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              required
              minLength={8}
              className="input pl-10"
            />
          </div>
          {password && (
            <div className="mt-2 flex items-center gap-2.5">
              <div className="flex flex-1 gap-1">
                {[1, 2, 3].map(step => (
                  <m.span
                    key={step}
                    initial={false}
                    animate={{ background: step <= strength ? strengthColor : 'var(--line-2)' }}
                    className="h-1 flex-1 rounded-full"
                  />
                ))}
              </div>
              <span className="mono text-[10.5px] text-[var(--fg-4)]">{strengthLabel}</span>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="confirm-password" className={field}>
            Confirm password
          </label>
          <div className="relative">
            <Lock className={iconCls} />
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              required
              minLength={8}
              className="input pl-10 pr-10"
            />
            {confirmPassword && password === confirmPassword && (
              <CheckCircle2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ok)]" aria-label="Passwords match" />
            )}
          </div>
        </div>

        <Button type="submit" variant="primary" disabled={isLoading} className="mt-2 w-full">
          {isLoading ? 'Creating account…' : 'Create account'}
          {!isLoading && <ArrowRight className="h-4 w-4" />}
        </Button>

        <p className="pt-1 text-center text-[13px] text-[var(--fg-4)]">
          Already have an account?{' '}
          <button type="button" onClick={onSwitchToLogin} className="font-medium text-[var(--accent)] transition-colors hover:text-[var(--fg)]">
            Sign in
          </button>
        </p>
      </form>
    </Modal>
  );
}
