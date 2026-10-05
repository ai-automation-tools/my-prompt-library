import { useState } from 'react';
import { AlertCircle, ArrowRight, Lock, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button, Modal, ModalHeader, Notice } from './ui/primitives';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup: () => void;
}

export default function LoginModal({ isOpen, onClose, onSwitchToSignup }: LoginModalProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      onClose();
      setEmail('');
      setPassword('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal onClose={onClose} size="sm" labelledBy="login-title">
      <ModalHeader id="login-title" eyebrow="Account" title="Welcome back" description="Sign in to reach your personal library." onClose={onClose} />

      <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
        {error && (
          <Notice>
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </Notice>
        )}

        <div>
          <label htmlFor="email" className="mb-1.5 block text-[13px] font-medium text-[var(--fg-2)]">
            Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fg-4)]" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
              autoFocus
              className="input pl-10"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-[13px] font-medium text-[var(--fg-2)]">
            Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fg-4)]" />
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              minLength={6}
              className="input pl-10"
            />
          </div>
        </div>

        <Button type="submit" variant="primary" disabled={isLoading} className="mt-2 w-full">
          {isLoading ? 'Signing in…' : 'Sign in'}
          {!isLoading && <ArrowRight className="h-4 w-4" />}
        </Button>

        <p className="pt-1 text-center text-[13px] text-[var(--fg-4)]">
          No account yet?{' '}
          <button type="button" onClick={onSwitchToSignup} className="font-medium text-[var(--accent)] transition-colors hover:text-[var(--fg)]">
            Create one
          </button>
        </p>
      </form>
    </Modal>
  );
}
