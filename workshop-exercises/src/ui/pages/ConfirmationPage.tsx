import React, { useEffect, useState } from 'react';

interface ConfirmationPageProps {
  userId: string;
  userEmail: string;
  paymentIntentId: string;
  token: string;
  onContinueShopping: () => void;
}

interface NotificationLog {
  id: string;
  type: string;
  email: string;
  subject: string;
  sentAt: string;
}

const ConfirmationPage: React.FC<ConfirmationPageProps> = ({
  userId,
  userEmail,
  paymentIntentId,
  token,
  onContinueShopping,
}) => {
  const [notificationSent, setNotificationSent] = useState(false);
  const [receiptLog, setReceiptLog] = useState<NotificationLog | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const sendReceipt = async () => {
      try {
        const response = await fetch('/api/notifications/receipt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            userId,
            email: userEmail,
            subject: 'Your order is confirmed!',
            body: `Payment ${paymentIntentId} has been captured. Thank you for your order.`,
            metadata: { paymentIntentId },
          }),
        });

        if (!response.ok) {
          const payload = (await response.json()) as { error?: { message?: string } };
          throw new Error(payload.error?.message ?? 'Failed to send receipt');
        }

        const payload = (await response.json()) as { data: NotificationLog };
        setReceiptLog(payload.data);
        setNotificationSent(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to send receipt');
      }
    };

    void sendReceipt();
  }, [userId, userEmail, paymentIntentId, token]);

  return (
    <main className="screen-shell">
      <div className="card">
        <h1 className="card__title" data-testid="confirmation-heading">Order Confirmed!</h1>
        <p className="card__subtitle">Thank you for your purchase.</p>

        <div>
          <p><strong>Payment ID:</strong> {paymentIntentId}</p>
          {notificationSent && receiptLog && (
            <p data-testid="receipt-sent">
              Receipt sent to <strong>{receiptLog.email}</strong>
            </p>
          )}
        </div>

        {error ? <div className="alert alert--error" role="alert">{error}</div> : null}

        <button
          className="btn btn--primary btn--full"
          type="button"
          onClick={onContinueShopping}
          data-testid="continue-shopping-btn"
        >
          Continue Shopping
        </button>
      </div>
    </main>
  );
};

export default ConfirmationPage;
