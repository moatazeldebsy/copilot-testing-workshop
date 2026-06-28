import React, { useState } from 'react';

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

interface CartPageProps {
  userId: string;
  token: string;
  onProceedToCheckout: (cart: Cart) => void;
}

const SAMPLE_PRODUCTS = [
  { productId: 'prod_1', name: 'Workshop T-Shirt', price: 25.0 },
  { productId: 'prod_2', name: 'Mechanical Keyboard', price: 149.99 },
  { productId: 'prod_3', name: 'USB-C Hub', price: 39.99 },
];

const CartPage: React.FC<CartPageProps> = ({ userId, token, onProceedToCheckout }) => {
  const [cart, setCart] = useState<Cart>({ userId, items: [], subtotal: 0 });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const addItem = async (product: (typeof SAMPLE_PRODUCTS)[number]) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/cart/${userId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...product, quantity: 1 }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: { message?: string } };
        throw new Error(payload.error?.message ?? 'Failed to add item');
      }

      const payload = (await response.json()) as { data: Cart };
      setCart(payload.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item');
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/cart/${userId}/items/${itemId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: { message?: string } };
        throw new Error(payload.error?.message ?? 'Failed to remove item');
      }

      const payload = (await response.json()) as { data: Cart };
      setCart(payload.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove item');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="screen-shell">
      <section className="card-stack card-stack--wide">
        <h1>Your Cart</h1>

        <div>
          <h2>Add items</h2>
          <div className="card-stack">
            {SAMPLE_PRODUCTS.map((product) => (
              <div key={product.productId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{product.name} — ${product.price.toFixed(2)}</span>
                <button type="button" onClick={() => void addItem(product)} disabled={isLoading}>
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>

        {cart.items.length > 0 && (
          <div>
            <h2>Cart items</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }} data-testid="cart-items">
              {cart.items.map((item) => (
                <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                  <span>{item.name} × {item.quantity} — ${(item.price * item.quantity).toFixed(2)}</span>
                  <button type="button" onClick={() => void removeItem(item.id)} disabled={isLoading}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <p><strong>Subtotal: ${cart.subtotal.toFixed(2)}</strong></p>
          </div>
        )}

        {error ? <p className="error-message" role="alert">{error}</p> : null}

        <button
          type="button"
          onClick={() => onProceedToCheckout(cart)}
          disabled={cart.items.length === 0 || isLoading}
        >
          Proceed to Checkout
        </button>
      </section>
    </main>
  );
};

export default CartPage;
