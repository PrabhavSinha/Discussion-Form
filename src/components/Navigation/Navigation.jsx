import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useForum } from '../../context/ForumContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useDebounce } from '../../hooks/index.js';

export default function Navigation() {
  const { categories, unreadCount } = useForum();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(searchQuery, 300);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (debouncedQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(debouncedQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Skip link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 bg-parchment-50/95 dark:bg-ink-950/95 backdrop-blur-sm border-b border-parchment-200 dark:border-ink-800">
        <div className="max-w-6xl mx-auto px-4">
          {/* Top bar */}
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <NavLink
              to="/"
              className="flex items-center gap-2 flex-shrink-0"
              aria-label="Discourse — Home"
            >
              <span className="text-2xl" aria-hidden="true">◈</span>
              <span className="font-display text-xl font-semibold text-ink-900 dark:text-parchment-100">
                Discourse
              </span>
            </NavLink>

            {/* Search */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex-1 max-w-md hidden sm:flex"
              role="search"
            >
              <div className="relative w-full">
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none"
                  aria-hidden="true"
                >
                  ⌕
                </span>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search discussions…"
                  className="input-base pl-9 h-9 py-0 text-sm"
                  aria-label="Search discussions"
                />
              </div>
            </form>

            {/* Right actions */}
            <div className="flex items-center gap-1">
              {/* Unread badge */}
              {unreadCount > 0 && (
                <span className="badge bg-rust-500 text-white" aria-label={`${unreadCount} unread threads`}>
                  {unreadCount}
                </span>
              )}

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="btn-ghost"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? '☀' : '◑'}
              </button>

              {/* New thread */}
              <NavLink to="/new" className="btn-primary hidden sm:inline-flex">
                <span aria-hidden="true">+</span> New Thread
              </NavLink>

              {/* Mobile menu */}
              <button
                className="btn-ghost sm:hidden"
                onClick={() => setMobileMenuOpen((o) => !o)}
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? '✕' : '≡'}
              </button>
            </div>
          </div>

          {/* Category nav */}
          <nav
            aria-label="Categories"
            className="hidden sm:flex items-center gap-1 pb-1 overflow-x-auto"
          >
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `btn-ghost text-xs px-3 py-1.5 whitespace-nowrap ${isActive ? 'bg-parchment-200 dark:bg-ink-700 font-semibold' : ''}`
              }
            >
              All
            </NavLink>
            {categories.map((cat) => (
              <NavLink
                key={cat.id}
                to={`/category/${cat.id}`}
                className={({ isActive }) =>
                  `btn-ghost text-xs px-3 py-1.5 whitespace-nowrap ${isActive ? 'bg-parchment-200 dark:bg-ink-700 font-semibold' : ''}`
                }
              >
                <span aria-hidden="true">{cat.icon}</span> {cat.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div
            className="sm:hidden border-t border-parchment-200 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 flex flex-col gap-3 animate-slide-down"
            aria-label="Mobile navigation"
          >
            <form onSubmit={handleSearchSubmit} role="search">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search discussions…"
                className="input-base"
                aria-label="Search discussions"
              />
            </form>
            <NavLink
              to="/new"
              className="btn-primary w-full justify-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              + New Thread
            </NavLink>
            <nav aria-label="Categories">
              <NavLink
                to="/"
                end
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md hover:bg-parchment-100 dark:hover:bg-ink-800 text-sm"
              >
                All Discussions
              </NavLink>
              {categories.map((cat) => (
                <NavLink
                  key={cat.id}
                  to={`/category/${cat.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-parchment-100 dark:hover:bg-ink-800 text-sm"
                >
                  <span aria-hidden="true">{cat.icon}</span> {cat.name}
                  <span className="ml-auto text-xs text-ink-400">{cat.threadCount}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
