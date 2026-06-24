import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Eye, EyeOff, Loader2 } from 'lucide-react';
import { PortalRole } from '@/auth/session';
import { authenticatePortal, PORTAL_HINTS } from '@/auth/login';

const PORTALS: { id: PortalRole; label: string }[] = [
  { id: 'customer', label: 'Customer' },
  { id: 'employee', label: 'Employee' },
  { id: 'admin', label: 'Admin' },
  { id: 'super-admin', label: 'Super Admin' },
];

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const [portal, setPortal] = useState<PortalRole>('customer');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const path = await authenticatePortal(portal, username.trim(), password);
      window.location.href = path;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setUsername('');
    setPassword('');
    setError('');
    setPortal('customer');
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="landing-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={resetAndClose}
        >
          <motion.div
            className="landing-modal"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="landing-modal-close" onClick={resetAndClose} aria-label="Close">
              <X size={20} />
            </button>

            <div className="landing-modal-header">
              <p className="landing-modal-eyebrow">Secure access</p>
              <h2>Sign in to Apex Bank</h2>
              <p className="landing-modal-sub">Choose your portal and enter your credentials.</p>
            </div>

            <form onSubmit={handleSubmit} className="landing-form">
              <label className="landing-label">Portal</label>
              <div className="landing-portal-grid">
                {PORTALS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`landing-portal-btn ${portal === item.id ? 'active' : ''}`}
                    onClick={() => {
                      setPortal(item.id);
                      setError('');
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <p className="landing-portal-hint">{PORTAL_HINTS[portal]}</p>

              <label className="landing-label" htmlFor="login-username">Email or mobile</label>
              <input
                id="login-username"
                className="landing-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="username"
              />

              <label className="landing-label" htmlFor="login-password">Password</label>
              <div className="landing-password-wrap">
                <input
                  id="login-password"
                  className="landing-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="landing-password-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {error && <p className="landing-form-error">{error}</p>}

              <button type="submit" className="landing-btn landing-btn-primary landing-btn-full" disabled={loading}>
                {loading ? <><Loader2 size={16} className="spin" /> Signing in…</> : 'Sign in securely'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
