import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');

  const redirectTarget = location.state?.from
    ? `${location.state.from.pathname || '/'}${location.state.from.search || ''}`
    : '/';

  const handleSubmit = (event) => {
    event.preventDefault();

    const result = login(nickname);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    setError('');
    navigate(redirectTarget, { replace: true });
  };

  return (
    <div className="login-shell">
      <section className="login-panel">
        <div className="login-brand">
          <div className="brand-mark">Я</div>
          <div>
            <p className="eyebrow">Russian Vocab Trainer</p>
            <h1>欢迎进入俄语背词空间</h1>
            <p className="panel-description">登录后开始你的俄语背词之旅，系统会按昵称自动保存并隔离学习进度。</p>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="search-box elevated-field">
            <span>输入你的昵称</span>
            <input
              type="text"
              maxLength={20}
              autoFocus
              spellCheck={false}
              placeholder="例如：Anna"
              value={nickname}
              onChange={(event) => {
                setNickname(event.target.value);
                if (error) {
                  setError('');
                }
              }}
            />
          </label>

          {error ? (
            <p className="form-error" role="alert">
              {error}
            </p>
          ) : (
            <p className="login-hint">不需要密码。输入昵称后即可进入，并拥有独立的本地学习记录。</p>
          )}

          <button type="submit" className="button primary login-submit">
            进入学习
          </button>
        </form>
      </section>
    </div>
  );
}
