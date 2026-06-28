import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onNavigateRegister: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigateRegister }) => {
  const [email, setEmail] = useState('alice@example.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await onLogin(email, password);
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="screen-shell">
      <div className="card">
        <div>
          <h1 className="card__title">Sign in</h1>
          <p className="card__subtitle">GenAI in Testing — WeAreDevelopers 2026</p>
        </div>

        <form onSubmit={(e) => void handleSubmit(e)} className="form-row">
          <label htmlFor="email">
            Email
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>
          <label htmlFor="password">
            Password
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>

          {error ? <div className="alert alert--error" role="alert">{error}</div> : null}

          <div className="form-actions">
            <button className="btn btn--primary btn--full" type="submit" disabled={isLoading}>
              {isLoading ? 'Signing in…' : 'Sign in'}
            </button>
            <button className="link-btn" type="button" onClick={onNavigateRegister}>
              Create account
            </button>
          </div>
        </form>

        <div className="alert alert--info" style={{ fontSize: '0.8rem' }}>
          Default: <strong>alice@example.com</strong> / <strong>workshop-password</strong>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
