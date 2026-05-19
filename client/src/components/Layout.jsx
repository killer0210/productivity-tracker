import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  House,
  ListBullets,
  CalendarBlank,
  GearSix,
  User,
  SignOut,
  MagnifyingGlass,
  Bell,
  GridFour,
} from '@phosphor-icons/react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const nav = [
  { path: '/dashboard', icon: House, label: 'Нүүр хуудас' },
  { path: '/entries', icon: ListBullets, label: 'Бүртгэл' },
  { path: '/calendar', icon: CalendarBlank, label: 'Календар' },
  { path: '/settings', icon: GearSix, label: 'Тохиргоо' },
];

function topBarDate() {
  const d = new Date();
  return `${d.getFullYear()} оны ${d.getMonth() + 1}-р сарын ${d.getDate()}`;
}

export default function Layout() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-[100dvh]">
      {/* Sidebar — desktop only */}
      <aside
        className="hidden md:flex w-60 shrink-0 text-white flex-col fixed inset-y-0 left-0 z-20"
        style={{ backgroundColor: '#1f4e79' }}
      >
        <div className="px-4 pt-4 pb-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-secondary rounded flex items-center justify-center shrink-0">
              <GridFour size={20} weight="bold" className="text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-black text-white leading-tight tracking-tight">
                Productivity Tracker
              </h1>
              <p className="text-[10px] text-primary-fixed-dim uppercase tracking-widest font-bold">
                Мэргэжлийн удирдлага
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-3 space-y-0.5">
          {nav.map(({ path, icon: Icon, label }) => {
            const active = pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150 ${
                  active
                    ? 'bg-primary text-white font-bold border-r-4 border-secondary-fixed'
                    : 'text-white/60 hover:bg-primary/30 hover:text-white'
                }`}
              >
                <Icon size={18} weight={active ? 'fill' : 'regular'} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 pt-3 pb-4 border-t border-white/10">
          <div className="flex items-center gap-2.5 p-2 hover:bg-white/10 rounded transition-colors cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
              <User size={14} className="text-on-secondary-container" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">Хэрэглэгчийн мэдээлэл</p>
              <p className="text-[10px] text-primary-fixed-dim truncate">
                {user?.email || 'Админ'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-2 py-1 text-xs text-white/40 hover:text-white/70 transition-colors mt-0.5"
          >
            <SignOut size={12} />
            Гарах
          </button>
        </div>
      </aside>

      {/* Right column */}
      <div className="flex-1 md:ml-60 flex flex-col min-h-[100dvh]">
        {/* Top app bar */}
        <header className="sticky top-0 z-10 h-14 bg-surface border-b border-outline-variant flex items-center justify-between px-4 md:px-6 shrink-0">
          <h2 className="text-sm md:text-base font-bold text-primary">{topBarDate()}</h2>
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <MagnifyingGlass
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-outline"
              />
              <input
                type="text"
                placeholder="Хайх..."
                className="pl-9 pr-4 py-1.5 bg-surface-container-low border border-outline-variant text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all w-56"
              />
            </div>
            <button className="relative w-9 h-9 flex items-center justify-center hover:bg-surface-container rounded-full transition-colors">
              <Bell size={18} className="text-on-surface-variant" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 bg-surface-container-low overflow-auto pb-16 md:pb-0">
          <Outlet />
        </main>
      </div>

      {/* Bottom navigation — mobile only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-outline-variant flex">
        {nav.map(({ path, icon: Icon, label }) => {
          const active = pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors ${
                active ? 'text-secondary' : 'text-on-surface-variant'
              }`}
            >
              <Icon size={22} weight={active ? 'fill' : 'regular'} />
              <span className="text-[10px] font-semibold leading-none">{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
