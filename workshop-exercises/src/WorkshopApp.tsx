import React, { useState } from 'react';
import { RegistrationForm } from './components/RegistrationForm';
import CartPage from './ui/pages/CartPage';
import CheckoutPage from './ui/pages/CheckoutPage';
import ConfirmationPage from './ui/pages/ConfirmationPage';
import LoginPage from './ui/pages/LoginPage';

const AUTH_TOKEN_KEY = 'workshop-auth-token';

type UserRole = 'admin' | 'viewer' | 'user';

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface Cart {
  userId: string;
  items: Array<{ id: string; name: string; price: number; quantity: number; productId: string }>;
  subtotal: number;
}

const Dashboard: React.FC<{ user: SessionUser; onLogout: () => void; onGoToCart: () => void }> = ({
  user,
  onLogout,
  onGoToCart,
}) => (
  <main className="screen-shell">
    <section className="card-stack card-stack--wide">
      <h1>Dashboard</h1>
      <p>This page exists to support the Playwright step.</p>
      <p>
        Signed in as <strong>{user.name}</strong> ({user.role})
      </p>
      <button type="button" onClick={onGoToCart}>Shop Now</button>
      <button type="button" onClick={onLogout}>Sign out</button>
    </section>
  </main>
);

function getStoredToken(): string {
  return window.localStorage.getItem(AUTH_TOKEN_KEY) ?? '';
}

const WorkshopApp: React.FC = () => {
  const [route, setRoute] = useState(window.location.pathname || '/register');
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(getStoredToken);
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [submissions, setSubmissions] = useState<string[]>([]);
  const [activeCart, setActiveCart] = useState<Cart | null>(null);
  const [completedPaymentId, setCompletedPaymentId] = useState('');

  const navigate = (nextRoute: string) => {
    window.history.pushState({}, '', nextRoute);
    setRoute(nextRoute);
  };

  const persistToken = (nextToken: string) => {
    setToken(nextToken);
    if (nextToken) {
      window.localStorage.setItem(AUTH_TOKEN_KEY, nextToken);
      return;
    }
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
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
    navigate('/dashboard');
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
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    persistToken('');
    setSessionUser(null);
    navigate('/login');
  };

  const requireAuth = (renderFn: () => React.ReactElement) => {
    if (!token || !sessionUser) {
      return <LoginPage onLogin={handleLogin} onNavigateRegister={() => navigate('/register')} />;
    }
    return renderFn();
  };

  if (route === '/dashboard') {
    return requireAuth(() => (
      <Dashboard
        user={sessionUser!}
        onLogout={handleLogout}
        onGoToCart={() => navigate('/cart')}
      />
    ));
  }

  if (route === '/cart') {
    return requireAuth(() => (
      <CartPage
        userId={sessionUser!.id}
        token={token}
        onProceedToCheckout={(cart) => {
          setActiveCart(cart);
          navigate('/checkout');
        }}
      />
    ));
  }

  if (route === '/checkout') {
    return requireAuth(() => {
      if (!activeCart) {
        navigate('/cart');
        return <></>;
      }
      return (
        <CheckoutPage
          cart={activeCart}
          token={token}
          onOrderComplete={(paymentIntentId) => {
            setCompletedPaymentId(paymentIntentId);
            navigate('/confirmation');
          }}
        />
      );
    });
  }

  if (route === '/confirmation') {
    return requireAuth(() => (
      <ConfirmationPage
        userId={sessionUser!.id}
        userEmail={sessionUser!.email}
        paymentIntentId={completedPaymentId}
        token={token}
        onContinueShopping={() => {
          setActiveCart(null);
          setCompletedPaymentId('');
          navigate('/cart');
        }}
      />
    ));
  }

  if (route === '/register') {
    return (
      <main className="screen-shell">
        <section className="card-stack card-stack--wide">
          <h1>Registration</h1>
          <p>Use this component in the RTL workshop step.</p>
          <RegistrationForm onSubmit={handleRegistration} isLoading={isLoading} />
          <button type="button" onClick={() => navigate('/login')}>Already have an account? Sign in</button>
          {submissions.length > 0 ? (
            <ul>
              {submissions.map((submission) => (
                <li key={submission}>{submission}</li>
              ))}
            </ul>
          ) : null}
        </section>
      </main>
    );
  }

  return <LoginPage onLogin={handleLogin} onNavigateRegister={() => navigate('/register')} />;
};

export default WorkshopApp;
