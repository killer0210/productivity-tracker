import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { GridFour, EnvelopeSimple, Lock } from '@phosphor-icons/react';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await register(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Бүртгэл амжилтгүй болсон.');
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
          <Link
            to="/login"
            className="flex-1 text-center py-2 text-[11px] font-semibold text-on-surface-variant hover:text-primary transition-colors uppercase tracking-wider"
          >
            Нэвтрэх
          </Link>
          <span className="flex-1 text-center py-2 text-[11px] font-semibold text-primary border-b-2 border-primary uppercase tracking-wider">
            Бүртгүүлэх
          </span>
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
                minLength={6}
                placeholder="Хамгийн багадаа 6 тэмдэгт"
                className="w-full text-sm border border-outline-variant pl-9 pr-3 py-2.5 focus:outline-none focus:border-primary bg-white transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white text-sm font-semibold py-3 hover:bg-primary-container active:scale-[0.99] transition-all duration-150 disabled:opacity-60 mt-2"
          >
            {loading ? 'Бүртгэж байна...' : 'Бүртгүүлэх →'}
          </button>
        </form>

        <p className="text-[11px] text-center text-on-surface-variant mt-6">
          © 2024 Бух эрх хуулиар хамгаалагдсан.
        </p>
      </div>
    </div>
  );
}
