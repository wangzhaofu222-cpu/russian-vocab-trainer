import { useNavigate } from 'react-router-dom';
import { buildUserInitial, useAuth } from '../hooks/useAuth';

export default function UserMenu() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="user-menu">
      <div className="user-chip">
        <span className="user-avatar" aria-hidden="true">
          {buildUserInitial(currentUser)}
        </span>
        <div className="user-meta">
          <span className="user-label">当前用户</span>
          <strong>{currentUser}</strong>
        </div>
      </div>
      <button type="button" className="button subtle" onClick={handleLogout}>
        退出
      </button>
    </div>
  );
}
