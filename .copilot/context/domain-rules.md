# Checkout Pipeline — Domain Rules

Use this file as context when generating tests or code for the checkout pipeline.
Attach it with `#file:.copilot/context/domain-rules.md` in your Copilot Chat prompt.

---

## Discount rules

| Code   | Type    | Value | Minimum order | Status  |
|--------|---------|-------|---------------|---------|
| SAVE10 | percent | 10%   | none          | active  |
| FLAT5  | flat    | $5    | $20           | active  |
| EXPIRED| percent | 15%   | none          | expired |

**Invariants:**
- `finalTotal` must never be negative — clamp to 0 if discount exceeds subtotal.
- `discountAmount` must never exceed `subtotal`.
- Flat discount is not applied when `subtotal < minOrder`.
- Unknown codes return zero discount without throwing.
- Codes are case-insensitive (`save10` == `SAVE10`).

---

## Fraud scoring rules

Risk points are additive. Final `riskLevel` is:

| Score range | Level  | Payment allowed? |
|-------------|--------|-----------------|
| 0–29        | low    | yes             |
| 30–59       | medium | yes             |
| 60+         | high   | no — blocked    |

Score contributors:
- Order total > $1000 → +40 points
- Item count > 20 → +30 points
- Shipping country `XX` or `ZZ` → +50 points (test/blacklisted countries)

---

## Payment lifecycle

```
pending → captured   (via POST /api/payment/:id/capture)
pending → failed     (on charge error)
captured → refunded  (via POST /api/payment/:id/refund)
```

Attempting an invalid transition (e.g. refunding a pending intent) returns
`INVALID_PAYMENT_STATE` with HTTP 409.

---

## Cart rules

- `price` must be ≥ 0.
- `quantity` must be an integer ≥ 1.
- Adding the same `productId` twice merges quantities (does not create a duplicate line).
- Removing a non-existent item returns `ITEM_NOT_FOUND` with HTTP 404.

---

## Error codes

| Code                   | HTTP | When                                        |
|------------------------|------|---------------------------------------------|
| VALIDATION_ERROR       | 400  | Missing or malformed request field          |
| UNAUTHORIZED           | 401  | Missing or invalid bearer token             |
| NOT_FOUND              | 404  | User / item / payment not found             |
| ITEM_NOT_FOUND         | 404  | Cart item does not exist                    |
| DUPLICATE_EMAIL        | 409  | Registration with existing email            |
| INVALID_PAYMENT_STATE  | 409  | Payment lifecycle transition not allowed    |
| INVALID_DISCOUNT_CODE  | 400  | Code does not exist                         |
| DISCOUNT_EXPIRED       | 400  | Code exists but past its expiry date        |
| ORDER_BELOW_MINIMUM    | 400  | Subtotal below minOrder for flat discount   |
| FRAUD_BLOCKED          | 422  | Risk level is high — payment blocked        |
