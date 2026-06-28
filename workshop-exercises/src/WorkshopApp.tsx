import React, { useEffect, useState } from 'react';
import { RegistrationForm } from './components/RegistrationForm';
import LoginPage from './ui/pages/LoginPage';
import StorePage from './ui/pages/StorePage';

const AUTH_TOKEN_KEY = 'workshop-auth-token';

type UserRole = 'admin' | 'viewer' | 'user';

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

function getStoredToken(): string {
  return window.localStorage.getItem(AUTH_TOKEN_KEY) ?? '';
}

const WorkshopApp: React.FC = () => {
  const [route, setRoute] = useState(window.location.pathname || '/store');
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(getStoredToken);
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [submissions, setSubmissions] = useState<string[]>([]);
  const [autoLogging, setAutoLogging] = useState(!getStoredToken());

  // Auto-login with workshop credentials so the store works on first load
  useEffect(() => {
    if (token) {
      setAutoLogging(false);
      return;
    }
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'alice@example.com', password: 'workshop-password' }),
    })
      .then((r) => r.json() as Promise<{ data: { token: string; user: SessionUser } }>)
      .then(({ data }) => {
        persistToken(data.token);
        setSessionUser(data.user);
      })
      .catch(() => { /* backend not ready yet — user can log in manually */ })
      .finally(() => { setAutoLogging(false); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigate = (nextRoute: string) => {
    window.history.pushState({}, '', nextRoute);
    setRoute(nextRoute);
  };

  const persistToken = (nextToken: string) => {
    setToken(nextToken);
    if (nextToken) {
      window.localStorage.setItem(AUTH_TOKEN_KEY, nextToken);
    } else {
      window.localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const payload = (await response.json()) as { error?: { message?: string } };
      throw new Error(payload.error?.message ?? 'Invalid credentials');
    }

    const payload = (await response.json()) as { data: { token: string; user: SessionUser } };
    persistToken(payload.data.token);
    setSessionUser(payload.data.user);
    navigate('/store');
  };

  const handleRegistration = async (data: {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'viewer' | 'user';
  }) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: { message?: string } };
        throw new Error(payload.error?.message ?? 'Registration failed');
      }

      const payload = (await response.json()) as { data: { token: string; user: SessionUser } };
      setSubmissions((current) => [...current, `${data.name} (${data.role})`]);
      persistToken(payload.data.token);
      setSessionUser(payload.data.user);
      navigate('/store');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    persistToken('');
    setSessionUser(null);
    navigate('/login');
  };

  if (route === '/store' || route === '/') {
    if (autoLogging) {
      return <div className="screen-shell" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading…</div>;
    }
    return (
      <StorePage
        userId={sessionUser?.id ?? ''}
        userEmail={sessionUser?.email ?? ''}
        token={token}
        onLogout={handleLogout}
      />
    );
  }

  if (route === '/register') {
    return (
      <div className="screen-shell">
        <div className="card">
          <h1 className="card__title">Create account</h1>
          <p className="card__subtitle">Use this component in the RTL workshop step.</p>
          <RegistrationForm onSubmit={handleRegistration} isLoading={isLoading} />
          <button className="link-btn" type="button" onClick={() => navigate('/login')}>
            Already have an account? Sign in
          </button>
          {submissions.length > 0 && (
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {submissions.map((s) => <li key={s}>{s}</li>)}
            </ul>
          )}
        </div>
      </div>
    );
  }

  if (route === '/login') {
    return <LoginPage onLogin={handleLogin} onNavigateRegister={() => navigate('/register')} />;
  }

  // Unknown route → go to store
  if (autoLogging) {
    return <div className="screen-shell" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading…</div>;
  }
  return (
    <StorePage
      userId={sessionUser?.id ?? ''}
      userEmail={sessionUser?.email ?? ''}
      token={token}
      onLogout={handleLogout}
    />
  );
};

export default WorkshopApp;
