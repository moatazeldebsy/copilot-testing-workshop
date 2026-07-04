import React, { useEffect, useState } from 'react';

interface Product {
  productId: string;
  name: string;
  description: string;
  price: number;
  emoji: string;
}

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Cart {
  userId: string;
  items: CartItem[];
  subtotal: number;
}

type CheckoutStep = 'cart' | 'discount' | 'paying' | 'confirmed';

interface StorePageProps {
  userId: string;
  userEmail: string;
  token: string;
  onLogout: () => void;
}

const PRODUCTS: Product[] = [
  { productId: 'prod_1', name: 'Workshop T-Shirt',    description: 'Soft cotton, dark mode colours', price: 25.00, emoji: '👕' },
  { productId: 'prod_2', name: 'Mechanical Keyboard',  description: 'Tactile switches, RGB backlight',  price: 149.99, emoji: '⌨️' },
  { productId: 'prod_3', name: 'USB-C Hub',            description: '7-in-1, 100W pass-through',        price: 39.99, emoji: '🔌' },
  { productId: 'prod_4', name: 'Sticker Pack',         description: '12 developer stickers',            price: 8.00, emoji: '🎨' },
  { productId: 'prod_5', name: 'Dev Mug',              description: 'Ceramic, 400 ml, dishwasher safe', price: 18.00, emoji: '☕' },
  { productId: 'prod_6', name: 'Notebook',             description: 'Dot-grid, 200 pages, hardcover',   price: 14.00, emoji: '📓' },
];

const emptyCart = (userId: string): Cart => ({ userId, items: [], subtotal: 0 });

const StorePage: React.FC<StorePageProps> = ({ userId, userEmail, token, onLogout }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [cart, setCart] = useState<Cart>(emptyCart(userId));
  const [step, setStep] = useState<CheckoutStep>('cart');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [error, setError] = useState('');
  const [promoError, setPromoError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const addItem = async (product: Product) => {
    setError('');
    try {
      const res = await fetch(`/api/cart/${userId}/items`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ productId: product.productId, name: product.name, price: product.price, quantity: 1 }),
      });
      const payload = (await res.json()) as { data?: Cart; error?: { message: string } };
      if (!res.ok) throw new Error(payload.error?.message ?? 'Failed to add item');
      setCart(payload.data!);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item');
    }
  };

  const removeItem = async (itemId: string) => {
    setError('');
    try {
      const res = await fetch(`/api/cart/${userId}/items/${itemId}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      const payload = (await res.json()) as { data?: Cart; error?: { message: string } };
      if (!res.ok) throw new Error(payload.error?.message ?? 'Failed to remove item');
      setCart(payload.data!);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove item');
    }
  };

  const applyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoError('');
    setIsLoading(true);
    try {
      const res = await fetch('/api/discount/apply', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ code: promoCode, subtotal: cart.subtotal }),
      });
      const payload = (await res.json()) as { data?: { discountAmount: number; finalTotal: number }; error?: { message: string } };
      if (!res.ok) throw new Error(payload.error?.message ?? 'Invalid code');
      setDiscountAmount(payload.data!.discountAmount);
      setFinalTotal(payload.data!.finalTotal);
      setPromoApplied(true);
    } catch (err) {
      setPromoError(err instanceof Error ? err.message : 'Invalid code');
    } finally {
      setIsLoading(false);
    }
  };

  const pay = async () => {
    setIsLoading(true);
    setError('');
    try {
      // Fraud check
      const fraudRes = await fetch('/api/fraud/check', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          userId,
          orderAmount: promoApplied ? finalTotal : cart.subtotal,
          itemCount: cart.items.reduce((s, i) => s + i.quantity, 0),
        }),
      });
      const fraudPayload = (await fraudRes.json()) as { data: { approved: boolean; riskLevel: string } };
      if (!fraudPayload.data.approved) {
        throw new Error(`Order blocked by security check (risk: ${fraudPayload.data.riskLevel})`);
      }

      // Charge
      const chargeRes = await fetch('/api/payment/charge', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ userId, amount: promoApplied ? finalTotal : cart.subtotal }),
      });
      const chargePayload = (await chargeRes.json()) as { data: { id: string }; error?: { message: string } };
      if (!chargeRes.ok) throw new Error(chargePayload.error?.message ?? 'Payment failed');

      // Capture
      const intentId = chargePayload.data.id;
      await fetch(`/api/payment/${intentId}/capture`, { method: 'POST', headers: authHeaders });

      // Receipt
      await fetch('/api/notifications/receipt', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          userId,
          email: userEmail,
          subject: 'Your order is confirmed!',
          body: `Payment ${intentId} captured. Thank you!`,
          metadata: { intentId },
        }),
      });

      setPaymentIntentId(intentId);
      setStep('confirmed');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  const reset = async () => {
    await fetch(`/api/cart/${userId}`, { method: 'DELETE', headers: authHeaders });
    setCart(emptyCart(userId));
    setStep('cart');
    setPromoCode('');
    setPromoApplied(false);
    setDiscountAmount(0);
    setFinalTotal(0);
    setPaymentIntentId('');
    setError('');
  };

  const total = promoApplied ? finalTotal : cart.subtotal;
  const hasItems = cart.items.length > 0;

  // ── Confirmation screen ──────────────────────────────────
  if (step === 'confirmed') {
    return (
      <>
        <header className="app-header">
          <div className="app-header__brand">
            <span className="app-header__brand-dot" />
            Workshop Store
          </div>
          <nav className="app-header__nav">
            <span className="app-header__user">{userEmail}</span>
            <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button className="btn btn--ghost btn--sm" type="button" onClick={onLogout}>Sign out</button>
          </nav>
        </header>
        <div className="confirmation-screen">
          <div className="confirmation-screen__icon">✅</div>
          <h1 className="confirmation-screen__title">Order confirmed!</h1>
          <p className="confirmation-screen__sub">
            Receipt sent to <strong>{userEmail}</strong>. Thanks for your purchase.
          </p>
          <div className="meta-pill" data-testid="payment-id">
            {paymentIntentId}
          </div>
          <button className="btn btn--primary" type="button" onClick={() => void reset()} data-testid="continue-shopping-btn">
            Continue shopping
          </button>
        </div>
      </>
    );
  }

  // ── Store layout ─────────────────────────────────────────
  return (
    <>
      <header className="app-header">
        <div className="app-header__brand">
          <span className="app-header__brand-dot" />
          Workshop Store
        </div>
        <nav className="app-header__nav">
          <span className="app-header__user">{userEmail}</span>
          <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button className="btn btn--ghost btn--sm" type="button" onClick={onLogout}>Sign out</button>
        </nav>
      </header>

      <div className="store-layout">
        {/* ── Left: product grid ── */}
        <main className="store-main">
          <h2 className="store-main__heading">Products</h2>
          <p className="store-main__sub">Add items to your cart, then checkout on the right.</p>

          {error ? <div className="alert alert--error" role="alert">{error}</div> : null}

          <div className="product-grid">
            {PRODUCTS.map((product) => (
              <article className="product-card" key={product.productId}>
                <div className="product-card__emoji">{product.emoji}</div>
                <div>
                  <div className="product-card__name">{product.name}</div>
                  <div className="product-card__desc">{product.description}</div>
                </div>
                <div className="product-card__footer">
                  <span className="product-card__price">${product.price.toFixed(2)}</span>
                  <button
                    className="btn btn--primary btn--sm"
                    type="button"
                    onClick={() => void addItem(product)}
                    data-testid={`add-${product.productId}`}
                  >
                    Add
                  </button>
                </div>
              </article>
            ))}
          </div>
        </main>

        {/* ── Right: cart panel ── */}
        <aside className="cart-panel">
          <div className="cart-panel__heading">
            Cart {hasItems ? `· ${cart.items.length} item${cart.items.length > 1 ? 's' : ''}` : ''}
          </div>

          {!hasItems ? (
            <div className="cart-empty">Your cart is empty</div>
          ) : (
            <>
              <div className="cart-items" data-testid="cart-items">
                {cart.items.map((item) => (
                  <div className="cart-item" key={item.id}>
                    <div>
                      <div className="cart-item__name">{item.name}</div>
                      <div className="cart-item__meta">qty {item.quantity}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="cart-item__price">${(item.price * item.quantity).toFixed(2)}</div>
                      <button
                        className="btn btn--danger"
                        type="button"
                        onClick={() => void removeItem(item.id)}
                        aria-label={`Remove ${item.name}`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo code */}
              <div className="checkout-section">
                <div className="checkout-section__label">Promo code</div>
                {promoApplied ? (
                  <div className="alert alert--success">
                    <span className="badge badge--success">{promoCode}</span>
                    &nbsp;−${discountAmount.toFixed(2)} applied
                  </div>
                ) : (
                  <>
                    <div className="promo-row">
                      <input
                        id="promo-code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="e.g. SAVE10"
                        onKeyDown={(e) => { if (e.key === 'Enter') void applyPromo(); }}
                      />
                      <button
                        className="btn btn--ghost btn--sm"
                        type="button"
                        onClick={() => void applyPromo()}
                        disabled={!promoCode.trim() || isLoading}
                      >
                        Apply
                      </button>
                    </div>
                    {promoError ? <div className="alert alert--error">{promoError}</div> : null}
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Try: <code>SAVE10</code>, <code>FLAT5</code>, <code>EXPIRED</code>
                    </div>
                  </>
                )}
              </div>

              {/* Order summary */}
              <div className="checkout-section">
                <div className="checkout-section__label">Order summary</div>
                <div className="order-summary">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>${cart.subtotal.toFixed(2)}</span>
                  </div>
                  {promoApplied && (
                    <div className="summary-row">
                      <span>Discount ({promoCode})</span>
                      <span style={{ color: 'var(--success)' }}>−${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="summary-row summary-row--total">
                    <span>Total</span>
                    <span data-testid="checkout-total">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {error ? <div className="alert alert--error" role="alert">{error}</div> : null}

              <button
                className="btn btn--primary btn--full"
                type="button"
                onClick={() => void pay()}
                disabled={isLoading}
                data-testid="pay-btn"
              >
                {isLoading ? 'Processing…' : `Pay $${total.toFixed(2)}`}
              </button>
            </>
          )}
        </aside>
      </div>
    </>
  );
};

export default StorePage;
