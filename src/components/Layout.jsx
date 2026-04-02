import { NavLink, Outlet } from 'react-router-dom';
import UserMenu from './UserMenu';

const navItems = [
  { to: '/', label: '首页' },
  { to: '/words', label: '单词列表' },
  { to: '/study', label: '背单词' },
  { to: '/mistakes', label: '错词本' },
  { to: '/stats', label: '学习统计' },
];

export default function Layout() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-block">
          <div className="brand-mark">Я</div>
          <div>
            <p className="eyebrow">Russian Vocab Trainer</p>
            <h1>俄语背单词网站</h1>
            <p className="brand-subtitle">用卡片和错词本高效记忆俄语单词</p>
          </div>
        </div>
        <nav className="topnav" aria-label="主导航">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <UserMenu />
      </header>

      <main className="page-container">
        <div className="content-shell">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
