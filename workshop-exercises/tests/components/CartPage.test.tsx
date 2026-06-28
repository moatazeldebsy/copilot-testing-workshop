import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import StorePage from '../../src/ui/pages/StorePage';

global.fetch = jest.fn();

const defaultProps = {
  userId: 'user-123',
  userEmail: 'alice@example.com',
  token: 'mock-token',
  onLogout: jest.fn(),
};

describe('StorePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the store header and product grid', () => {
    // TODO: use Copilot to generate this test
  });

  it('shows an empty cart state initially', () => {
    // TODO: use Copilot to generate this test
  });

  it('calls the cart API when Add is clicked', async () => {
    // TODO: use Copilot to generate this test
    // Hint: mock fetch to return a cart with one item, click Add, assert fetch was called
  });

  it('disables Pay button when cart is empty', () => {
    // TODO: use Copilot to generate this test
  });

  it('shows order summary with discount when promo code is applied', async () => {
    // TODO: use Copilot to generate this test
  });
});
