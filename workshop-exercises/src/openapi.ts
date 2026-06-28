export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Workshop Checkout API',
    description:
      'The system under test for the **GenAI in Testing** workshop at WeAreDevelopers 2026.\n\n' +
      'A realistic checkout pipeline — **User → Cart → Discount → Fraud → Payment → Notification** — ' +
      'that threads every test type (unit, API, component, E2E) through a single domain.\n\n' +
      '**Seed credentials:** `alice@example.com` / `workshop-password`\n\n' +
      '**Promo codes:** `SAVE10` (10% off), `FLAT5` ($5 flat, min $20), `EXPIRED` (expired — good for error-path tests)',
    version: '1.0.0',
    contact: { name: 'Workshop repo', url: 'https://github.com' },
  },
  servers: [{ url: 'http://localhost:4000', description: 'Local dev' }],
  tags: [
    { name: 'Auth',         description: 'Registration and login' },
    { name: 'Users',        description: 'User management (protected)' },
    { name: 'Cart',         description: 'Shopping cart (protected)' },
    { name: 'Discount',     description: 'Promo codes and pricing rules (protected)' },
    { name: 'Fraud',        description: 'Risk check before charging (protected)' },
    { name: 'Payment',      description: 'Charge, capture, and refund (protected)' },
    { name: 'Notification', description: 'Receipts and order emails (protected)' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'object',
            properties: {
              code:    { type: 'string', example: 'VALIDATION_ERROR' },
              message: { type: 'string', example: 'Name is required' },
            },
          },
        },
      },
      PublicUser: {
        type: 'object',
        properties: {
          id:        { type: 'string', format: 'uuid' },
          name:      { type: 'string', example: 'Alice Admin' },
          email:     { type: 'string', format: 'email', example: 'alice@example.com' },
          role:      { type: 'string', enum: ['admin', 'viewer', 'user'] },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      CartItem: {
        type: 'object',
        properties: {
          id:        { type: 'string', format: 'uuid' },
          productId: { type: 'string', example: 'prod_1' },
          name:      { type: 'string', example: 'Workshop T-Shirt' },
          price:     { type: 'number', example: 25.00 },
          quantity:  { type: 'integer', example: 2 },
        },
      },
      Cart: {
        type: 'object',
        properties: {
          userId:    { type: 'string', format: 'uuid' },
          items:     { type: 'array', items: { '$ref': '#/components/schemas/CartItem' } },
          subtotal:  { type: 'number', example: 50.00 },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      DiscountResult: {
        type: 'object',
        properties: {
          code:           { type: 'string', example: 'SAVE10' },
          type:           { type: 'string', enum: ['percent', 'flat'] },
          value:          { type: 'number', example: 10 },
          discountAmount: { type: 'number', example: 5.00 },
          finalTotal:     { type: 'number', example: 45.00 },
        },
      },
      FraudCheckResult: {
        type: 'object',
        properties: {
          approved:  { type: 'boolean', example: true },
          riskLevel: { type: 'string', enum: ['low', 'medium', 'high'] },
          riskScore: { type: 'integer', example: 0 },
          reasons:   { type: 'array', items: { type: 'string' } },
        },
      },
      PaymentIntent: {
        type: 'object',
        properties: {
          id:        { type: 'string', example: 'pi_550e8400-e29b-41d4-a716-446655440000' },
          userId:    { type: 'string', format: 'uuid' },
          amount:    { type: 'number', example: 45.00 },
          currency:  { type: 'string', example: 'usd' },
          status:    { type: 'string', enum: ['pending', 'captured', 'refunded', 'failed'] },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      NotificationLog: {
        type: 'object',
        properties: {
          id:      { type: 'string', format: 'uuid' },
          userId:  { type: 'string', format: 'uuid' },
          type:    { type: 'string', enum: ['receipt', 'order_confirmation', 'refund'] },
          email:   { type: 'string', format: 'email' },
          subject: { type: 'string', example: 'Your order is confirmed!' },
          sentAt:  { type: 'string', format: 'date-time' },
        },
      },
    },
  },
  paths: {
    // ── Auth ────────────────────────────────────────────────
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name:     { type: 'string', example: 'Bob Builder' },
                  email:    { type: 'string', format: 'email', example: 'bob@example.com' },
                  password: { type: 'string', minLength: 8, example: 'supersecure123' },
                  role:     { type: 'string', enum: ['admin', 'viewer', 'user'], default: 'viewer' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'User created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'object',
                      properties: {
                        user:  { '$ref': '#/components/schemas/PublicUser' },
                        token: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { description: 'Validation error', content: { 'application/json': { schema: { '$ref': '#/components/schemas/Error' } } } },
          409: { description: 'Email already registered', content: { 'application/json': { schema: { '$ref': '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login and receive a JWT',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email:    { type: 'string', format: 'email', example: 'alice@example.com' },
                  password: { type: 'string', example: 'workshop-password' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'JWT token and user profile',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'object',
                      properties: {
                        token: { type: 'string' },
                        user:  { '$ref': '#/components/schemas/PublicUser' },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { description: 'Invalid credentials', content: { 'application/json': { schema: { '$ref': '#/components/schemas/Error' } } } },
        },
      },
    },

    // ── Users ────────────────────────────────────────────────
    '/api/users': {
      post: {
        tags: ['Users'],
        summary: 'Create a user (public — for workshop exercises)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name:     { type: 'string', example: 'Carol' },
                  email:    { type: 'string', format: 'email', example: 'carol@example.com' },
                  password: { type: 'string', example: 'supersecure123' },
                  role:     { type: 'string', enum: ['admin', 'viewer', 'user'] },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'User created', content: { 'application/json': { schema: { type: 'object', properties: { data: { '$ref': '#/components/schemas/PublicUser' } } } } } },
          400: { description: 'Validation error', content: { 'application/json': { schema: { '$ref': '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/users/{id}': {
      get: {
        tags: ['Users'],
        summary: 'Get user by ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200: { description: 'User profile', content: { 'application/json': { schema: { type: 'object', properties: { data: { '$ref': '#/components/schemas/PublicUser' } } } } } },
          401: { description: 'Unauthorized', content: { 'application/json': { schema: { '$ref': '#/components/schemas/Error' } } } },
          404: { description: 'User not found', content: { 'application/json': { schema: { '$ref': '#/components/schemas/Error' } } } },
        },
      },
      delete: {
        tags: ['Users'],
        summary: 'Delete user by ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          204: { description: 'Deleted' },
          401: { description: 'Unauthorized', content: { 'application/json': { schema: { '$ref': '#/components/schemas/Error' } } } },
          404: { description: 'User not found', content: { 'application/json': { schema: { '$ref': '#/components/schemas/Error' } } } },
        },
      },
    },

    // ── Cart ────────────────────────────────────────────────
    '/api/cart/{userId}': {
      get: {
        tags: ['Cart'],
        summary: 'Get cart for a user',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200: { description: 'Cart contents', content: { 'application/json': { schema: { type: 'object', properties: { data: { '$ref': '#/components/schemas/Cart' } } } } } },
        },
      },
      delete: {
        tags: ['Cart'],
        summary: 'Clear the cart',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { 204: { description: 'Cart cleared' } },
      },
    },
    '/api/cart/{userId}/items': {
      post: {
        tags: ['Cart'],
        summary: 'Add an item to the cart',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['productId', 'name', 'price'],
                properties: {
                  productId: { type: 'string', example: 'prod_1' },
                  name:      { type: 'string', example: 'Workshop T-Shirt' },
                  price:     { type: 'number', example: 25.00 },
                  quantity:  { type: 'integer', default: 1, example: 1 },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Updated cart', content: { 'application/json': { schema: { type: 'object', properties: { data: { '$ref': '#/components/schemas/Cart' } } } } } },
          400: { description: 'Validation error', content: { 'application/json': { schema: { '$ref': '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/cart/{userId}/items/{itemId}': {
      delete: {
        tags: ['Cart'],
        summary: 'Remove an item from the cart',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'userId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          { name: 'itemId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: { description: 'Updated cart', content: { 'application/json': { schema: { type: 'object', properties: { data: { '$ref': '#/components/schemas/Cart' } } } } } },
          404: { description: 'Item not found', content: { 'application/json': { schema: { '$ref': '#/components/schemas/Error' } } } },
        },
      },
    },

    // ── Discount ────────────────────────────────────────────
    '/api/discount/validate': {
      post: {
        tags: ['Discount'],
        summary: 'Check if a promo code is valid',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', required: ['code'], properties: { code: { type: 'string', example: 'SAVE10' } } } } },
        },
        responses: {
          200: { description: 'Code is valid', content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'object', properties: { valid: { type: 'boolean' }, code: { type: 'string' } } } } } } } },
          400: { description: 'Expired code', content: { 'application/json': { schema: { '$ref': '#/components/schemas/Error' } } } },
          404: { description: 'Code not found', content: { 'application/json': { schema: { '$ref': '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/discount/apply': {
      post: {
        tags: ['Discount'],
        summary: 'Apply a promo code to a subtotal',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['code', 'subtotal'],
                properties: {
                  code:     { type: 'string', example: 'SAVE10' },
                  subtotal: { type: 'number', example: 50.00 },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Discount applied', content: { 'application/json': { schema: { type: 'object', properties: { data: { '$ref': '#/components/schemas/DiscountResult' } } } } } },
          400: { description: 'Expired or order below minimum', content: { 'application/json': { schema: { '$ref': '#/components/schemas/Error' } } } },
          404: { description: 'Code not found', content: { 'application/json': { schema: { '$ref': '#/components/schemas/Error' } } } },
        },
      },
    },

    // ── Fraud ────────────────────────────────────────────────
    '/api/fraud/check': {
      post: {
        tags: ['Fraud'],
        summary: 'Run a risk check on an order',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['userId', 'orderAmount', 'itemCount'],
                properties: {
                  userId:      { type: 'string', format: 'uuid' },
                  orderAmount: { type: 'number', example: 45.00 },
                  itemCount:   { type: 'integer', example: 2 },
                  ipCountry:   { type: 'string', example: 'DE', description: 'ISO 3166-1 alpha-2. Use XX or ZZ to trigger high-risk.' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Fraud check result', content: { 'application/json': { schema: { type: 'object', properties: { data: { '$ref': '#/components/schemas/FraudCheckResult' } } } } } },
        },
      },
    },

    // ── Payment ──────────────────────────────────────────────
    '/api/payment/charge': {
      post: {
        tags: ['Payment'],
        summary: 'Create a PaymentIntent (pending)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['userId', 'amount'],
                properties: {
                  userId:   { type: 'string', format: 'uuid' },
                  amount:   { type: 'number', example: 45.00 },
                  currency: { type: 'string', default: 'usd', example: 'usd' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'PaymentIntent created', content: { 'application/json': { schema: { type: 'object', properties: { data: { '$ref': '#/components/schemas/PaymentIntent' } } } } } },
          400: { description: 'Validation error', content: { 'application/json': { schema: { '$ref': '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/payment/{id}': {
      get: {
        tags: ['Payment'],
        summary: 'Get a PaymentIntent by ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', example: 'pi_550e8400' } }],
        responses: {
          200: { description: 'PaymentIntent', content: { 'application/json': { schema: { type: 'object', properties: { data: { '$ref': '#/components/schemas/PaymentIntent' } } } } } },
          404: { description: 'Not found', content: { 'application/json': { schema: { '$ref': '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/payment/{id}/capture': {
      post: {
        tags: ['Payment'],
        summary: 'Capture a pending PaymentIntent',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', example: 'pi_550e8400' } }],
        responses: {
          200: { description: 'Captured', content: { 'application/json': { schema: { type: 'object', properties: { data: { '$ref': '#/components/schemas/PaymentIntent' } } } } } },
          400: { description: 'Invalid state', content: { 'application/json': { schema: { '$ref': '#/components/schemas/Error' } } } },
          404: { description: 'Not found', content: { 'application/json': { schema: { '$ref': '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/payment/{id}/refund': {
      post: {
        tags: ['Payment'],
        summary: 'Refund a captured PaymentIntent',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', example: 'pi_550e8400' } }],
        responses: {
          200: { description: 'Refunded', content: { 'application/json': { schema: { type: 'object', properties: { data: { '$ref': '#/components/schemas/PaymentIntent' } } } } } },
          400: { description: 'Invalid state', content: { 'application/json': { schema: { '$ref': '#/components/schemas/Error' } } } },
          404: { description: 'Not found', content: { 'application/json': { schema: { '$ref': '#/components/schemas/Error' } } } },
        },
      },
    },

    // ── Notification ─────────────────────────────────────────
    '/api/notifications/receipt': {
      post: {
        tags: ['Notification'],
        summary: 'Send a receipt email (logged, not actually sent)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['userId', 'email', 'subject', 'body'],
                properties: {
                  userId:  { type: 'string', format: 'uuid' },
                  email:   { type: 'string', format: 'email', example: 'alice@example.com' },
                  subject: { type: 'string', example: 'Your order is confirmed!' },
                  body:    { type: 'string', example: 'Payment pi_xxx captured. Thank you!' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Notification logged', content: { 'application/json': { schema: { type: 'object', properties: { data: { '$ref': '#/components/schemas/NotificationLog' } } } } } },
        },
      },
    },
    '/api/notifications/{userId}': {
      get: {
        tags: ['Notification'],
        summary: 'Get notification logs for a user',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200: { description: 'Notification logs', content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'array', items: { '$ref': '#/components/schemas/NotificationLog' } } } } } } },
        },
      },
    },
  },
};
