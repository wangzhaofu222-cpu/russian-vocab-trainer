import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: '首页' },
  { to: '/words', label: '单词列表' },
  { to: '/study', label: '背单词' },
  { to: '/mistakes', label: '错词本' },
];

export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Russian Vocabulary</p>
          <h1>俄语背单词网站</h1>
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
      </header>

      <main className="page-container">{children}</main>
    </div>
  );
}
