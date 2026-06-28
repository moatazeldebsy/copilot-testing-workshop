import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onNavigateRegister: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigateRegister }) => {
  const [email, setEmail] = useState('alice@example.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    try {
      await onLogin(email, password);
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Invalid credentials');
    }
  };

  return (
    <main className="screen-shell">
      <section className="card-stack card-stack--wide">
        <h1>Workshop Login</h1>
        <form onSubmit={handleSubmit} className="card-stack">
          <label htmlFor="email">
            Email
            <input
              id="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label htmlFor="password">
            Password
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {error ? <p className="error-message" role="alert">{error}</p> : null}

          <button type="submit">Sign in</button>
          <button type="button" onClick={onNavigateRegister}>Create account</button>
        </form>
      </section>
    </main>
  );
};

export default LoginPage;