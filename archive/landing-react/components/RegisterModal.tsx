import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Loader2, CheckCircle2 } from 'lucide-react';
import { requireSupabase } from '@/lib/supabaseClient';

interface RegisterModalProps {
  open: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
}

export default function RegisterModal({ open, onClose, onOpenLogin }: RegisterModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    pan: '',
    password: '',
    confirmPassword: '',
    accountType: 'Savings Account',
  });

  const update = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const reset = () => {
    setForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      pan: '',
      password: '',
      confirmPassword: '',
      accountType: 'Savings Account',
    });
    setError('');
    setSuccess(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const client = requireSupabase();
      const fullName = `${form.firstName} ${form.lastName}`.trim();

      const { error: insertError } = await client.from('students').insert({
        full_name: fullName,
        email_address: form.email,
        mobile_number: form.phone,
        password: form.password,
        pan_card: form.pan.toUpperCase(),
        account_type: form.accountType,
      });

      if (insertError) throw new Error(insertError.message);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="landing-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="landing-modal landing-modal-wide"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="landing-modal-close" onClick={handleClose} aria-label="Close">
              <X size={20} />
            </button>

            {success ? (
              <div className="landing-success">
                <CheckCircle2 size={48} className="landing-success-icon" />
                <h2>Account request received</h2>
                <p>Your registration has been submitted. Sign in once verification is complete.</p>
                <button
                  type="button"
                  className="landing-btn landing-btn-primary"
                  onClick={() => {
                    handleClose();
                    onOpenLogin();
                  }}
                >
                  Go to login
                </button>
              </div>
            ) : (
              <>
                <div className="landing-modal-header">
                  <p className="landing-modal-eyebrow">New customer</p>
                  <h2>Open your Apex Bank account</h2>
                  <p className="landing-modal-sub">Digital onboarding with e-KYC — takes under 3 minutes.</p>
                </div>

                <form onSubmit={handleSubmit} className="landing-form landing-form-grid">
                  <div>
                    <label className="landing-label">First name</label>
                    <input className="landing-input" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} required />
                  </div>
                  <div>
                    <label className="landing-label">Last name</label>
                    <input className="landing-input" value={form.lastName} onChange={(e) => update('lastName', e.target.value)} required />
                  </div>
                  <div>
                    <label className="landing-label">Email</label>
                    <input className="landing-input" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required />
                  </div>
                  <div>
                    <label className="landing-label">Mobile</label>
                    <input className="landing-input" type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} required />
                  </div>
                  <div>
                    <label className="landing-label">PAN</label>
                    <input className="landing-input" value={form.pan} onChange={(e) => update('pan', e.target.value.toUpperCase())} required maxLength={10} />
                  </div>
                  <div>
                    <label className="landing-label">Account type</label>
                    <select className="landing-input" value={form.accountType} onChange={(e) => update('accountType', e.target.value)}>
                      <option>Savings Account</option>
                      <option>Current Account</option>
                      <option>Student Account</option>
                    </select>
                  </div>
                  <div>
                    <label className="landing-label">Password</label>
                    <input className="landing-input" type="password" value={form.password} onChange={(e) => update('password', e.target.value)} required minLength={6} />
                  </div>
                  <div>
                    <label className="landing-label">Confirm password</label>
                    <input className="landing-input" type="password" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} required minLength={6} />
                  </div>

                  {error && <p className="landing-form-error landing-form-error-span">{error}</p>}

                  <button type="submit" className="landing-btn landing-btn-primary landing-form-submit" disabled={loading}>
                    {loading ? <><Loader2 size={16} className="spin" /> Submitting…</> : 'Submit application'}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
