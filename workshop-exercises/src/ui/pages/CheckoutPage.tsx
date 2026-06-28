import React, { useState } from 'react';

interface Cart {
  userId: string;
  items: Array<{ id: string; name: string; price: number; quantity: number }>;
  subtotal: number;
}

interface CheckoutPageProps {
  cart: Cart;
  token: string;
  onOrderComplete: (orderId: string) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ cart, token, onOrderComplete }) => {
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(cart.subtotal);
  const [fraudStatus, setFraudStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'discount' | 'fraud' | 'pay'>('discount');

  const applyDiscount = async () => {
    if (!promoCode.trim()) return;
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/discount/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ code: promoCode, subtotal: cart.subtotal }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: { message?: string } };
        throw new Error(payload.error?.message ?? 'Invalid promo code');
      }

      const payload = (await response.json()) as { data: { discountAmount: number; finalTotal: number } };
      setDiscountAmount(payload.data.discountAmount);
      setFinalTotal(payload.data.finalTotal);
      setStep('fraud');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply discount');
    } finally {
      setIsLoading(false);
    }
  };

  const runFraudCheck = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/fraud/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          userId: cart.userId,
          orderAmount: finalTotal,
          itemCount: cart.items.reduce((sum, i) => sum + i.quantity, 0),
        }),
      });

      const payload = (await response.json()) as { data: { approved: boolean; riskLevel: string } };

      if (payload.data.approved) {
        setFraudStatus('approved');
        setStep('pay');
      } else {
        setFraudStatus('rejected');
        setError(`Order blocked — risk level: ${payload.data.riskLevel}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fraud check failed');
    } finally {
      setIsLoading(false);
    }
  };

  const pay = async () => {
    setIsLoading(true);
    setError('');
    try {
      const chargeResponse = await fetch('/api/payment/charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId: cart.userId, amount: finalTotal }),
      });

      if (!chargeResponse.ok) {
        const payload = (await chargeResponse.json()) as { error?: { message?: string } };
        throw new Error(payload.error?.message ?? 'Payment failed');
      }

      const chargePayload = (await chargeResponse.json()) as { data: { id: string } };
      const intentId = chargePayload.data.id;

      const captureResponse = await fetch(`/api/payment/${intentId}/capture`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!captureResponse.ok) {
        const payload = (await captureResponse.json()) as { error?: { message?: string } };
        throw new Error(payload.error?.message ?? 'Payment capture failed');
      }

      setPaymentIntentId(intentId);
      onOrderComplete(intentId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="screen-shell">
      <section className="card-stack card-stack--wide">
        <h1>Checkout</h1>

        <div>
          <p>Subtotal: <strong>${cart.subtotal.toFixed(2)}</strong></p>
          {discountAmount > 0 && (
            <p>Discount ({promoCode}): <strong>−${discountAmount.toFixed(2)}</strong></p>
          )}
          <p>Total: <strong data-testid="checkout-total">${finalTotal.toFixed(2)}</strong></p>
        </div>

        {step === 'discount' && (
          <div className="card-stack">
            <label htmlFor="promo-code">
              Promo code (optional)
              <input
                id="promo-code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="e.g. SAVE10"
              />
            </label>
            <button type="button" onClick={() => void applyDiscount()} disabled={isLoading}>
              {promoCode ? 'Apply & Continue' : 'Skip — Continue'}
            </button>
            {!promoCode && (
              <button type="button" onClick={() => setStep('fraud')} disabled={isLoading}>
                Skip discount
              </button>
            )}
          </div>
        )}

        {step === 'fraud' && (
          <div className="card-stack">
            <p>Running security check before payment…</p>
            <button type="button" onClick={() => void runFraudCheck()} disabled={isLoading} data-testid="fraud-check-btn">
              Run Security Check
            </button>
          </div>
        )}

        {step === 'pay' && fraudStatus === 'approved' && (
          <div className="card-stack">
            <p style={{ color: '#86efac' }}>Security check passed</p>
            <button type="button" onClick={() => void pay()} disabled={isLoading} data-testid="pay-btn">
              Pay ${finalTotal.toFixed(2)}
            </button>
          </div>
        )}

        {error ? <p className="error-message" role="alert">{error}</p> : null}
      </section>
    </main>
  );
};

export default CheckoutPage;
