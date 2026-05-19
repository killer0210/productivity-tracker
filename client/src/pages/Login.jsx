import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { GridFour, EnvelopeSimple, Lock } from '@phosphor-icons/react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Нэвтрэх амжилтгүй. Мэдээллээ шалгана уу.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-gradient-to-br from-surface-container to-primary-fixed p-4">
      <div className="bg-white border border-outline-variant w-full max-w-sm p-8 shadow-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-primary-fixed flex items-center justify-center mb-3">
            <GridFour size={24} weight="bold" className="text-primary" />
          </div>
          <h1 className="text-xl font-bold text-primary tracking-tight">Productivity Tracker</h1>
          <p className="text-[11px] text-on-surface-variant mt-1 text-center">
            Мэргэжлийн түвшний бүтээмжийн удирдлага
          </p>
        </div>

        <div className="flex border-b border-outline-variant mb-6">
          <span className="flex-1 text-center py-2 text-[11px] font-semibold text-primary border-b-2 border-primary uppercase tracking-wider">
            Нэвтрэх
          </span>
          <Link
            to="/register"
            className="flex-1 text-center py-2 text-[11px] font-semibold text-on-surface-variant hover:text-primary transition-colors uppercase tracking-wider"
          >
            Бүртгүүлэх
          </Link>
        </div>

        {error && (
          <div className="text-xs text-error mb-4 bg-red-50 border border-red-100 px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
              И-мэйл хаяг
            </label>
            <div className="relative">
              <EnvelopeSimple
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-outline"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                placeholder="example@tracker.mn"
                className="w-full text-sm border border-outline-variant pl-9 pr-3 py-2.5 focus:outline-none focus:border-primary bg-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
              Нууц үг
            </label>
            <div className="relative">
              <Lock
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-outline"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full text-sm border border-outline-variant pl-9 pr-3 py-2.5 focus:outline-none focus:border-primary bg-white transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 accent-primary"
              />
              <span className="text-xs text-on-surface-variant">Намайг санах</span>
            </label>
            <button
              type="button"
              className="text-xs text-primary hover:underline transition-colors"
            >
              Нууц үг мартсан?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white text-sm font-semibold py-3 hover:bg-primary-container active:scale-[0.99] transition-all duration-150 disabled:opacity-60"
          >
            {loading ? 'Нэвтэрч байна...' : 'Нэвтрэх →'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-outline-variant" />
          <span className="text-[11px] text-on-surface-variant font-medium">эсвэл нэвтрэх</span>
          <div className="flex-1 h-px bg-outline-variant" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="flex items-center justify-center gap-2 border border-outline-variant px-3 py-2.5 text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 border border-outline-variant px-3 py-2.5 text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 23 23" fill="none" aria-hidden="true">
              <path d="M1 1h10v10H1z" fill="#F25022"/>
              <path d="M12 1h10v10H12z" fill="#7FBA00"/>
              <path d="M1 12h10v10H1z" fill="#00A4EF"/>
              <path d="M12 12h10v10H12z" fill="#FFB900"/>
            </svg>
            Microsoft
          </button>
        </div>

        <p className="text-[11px] text-center text-on-surface-variant mt-6">
          © 2024 Бух эрх хуулиар хамгаалагдсан.
        </p>
      </div>
    </div>
  );
}
