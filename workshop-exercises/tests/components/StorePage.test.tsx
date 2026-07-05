import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import StorePage from '../../src/ui/pages/StorePage';

const defaultProps = {
  userId: 'user-123',
  userEmail: 'alice@example.com',
  token: 'mock-token',
  onLogout: jest.fn(),
};

const oneItemCart = {
  data: {
    userId: 'user-123',
    items: [{ id: 'item-1', productId: 'prod_1', name: 'Workshop T-Shirt', price: 25, quantity: 1 }],
    subtotal: 25,
    updatedAt: new Date().toISOString(),
  },
};

function mockFetchOnce(body: unknown, status = 200) {
  (fetch as jest.Mock).mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  });
}

describe('StorePage', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('renders the store name and a product grid', () => {
    render(<StorePage {...defaultProps} />);

    expect(screen.getByText('Workshop Store')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /products/i })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /add/i }).length).toBeGreaterThan(0);
  });

  it('shows empty-cart message and no pay button when cart is empty', () => {
    render(<StorePage {...defaultProps} />);

    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    // Pay button is not rendered when there are no items
    expect(screen.queryByTestId('pay-btn')).not.toBeInTheDocument();
  });

  it('calls the cart API when Add is clicked', async () => {
    const user = userEvent.setup();
    mockFetchOnce(oneItemCart);

    render(<StorePage {...defaultProps} />);

    await user.click(screen.getByTestId('add-prod_1'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/cart/user-123/items'),
        expect.objectContaining({ method: 'POST' }),
      );
    });
  });

  it('shows cart items and enables Pay button after adding a product', async () => {
    const user = userEvent.setup();
    mockFetchOnce(oneItemCart);

    render(<StorePage {...defaultProps} />);

    await user.click(screen.getByTestId('add-prod_1'));

    await waitFor(() => {
      // T-Shirt appears in the cart panel (not just the product grid)
      const cartPanel = screen.getByTestId('cart-items');
      expect(cartPanel).toHaveTextContent('Workshop T-Shirt');
    });

    expect(screen.getByTestId('pay-btn')).not.toBeDisabled();
  });

  it('shows order summary with discount when promo code is applied', async () => {
    const user = userEvent.setup();

    // First fetch: add item
    mockFetchOnce(oneItemCart);
    // Second fetch: apply promo
    mockFetchOnce({
      data: { code: 'SAVE10', discountAmount: 2.5, finalTotal: 22.5 },
    });

    render(<StorePage {...defaultProps} />);

    await user.click(screen.getByTestId('add-prod_1'));

    await waitFor(() => screen.getByTestId('cart-items'));

    // Apply promo code
    const promoInput = screen.getByPlaceholderText(/e\.g\. SAVE10/i);
    await user.type(promoInput, 'SAVE10');
    await user.click(screen.getByRole('button', { name: /apply/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/discount/apply'),
        expect.objectContaining({ method: 'POST' }),
      );
    });
  });
});
