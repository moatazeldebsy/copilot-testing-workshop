import crypto from 'node:crypto';

interface TokenPayload {
  userId: string;
  email: string;
  role: 'admin' | 'viewer' | 'user';
  exp: number;
}

const SECRET = process.env.WORKSHOP_TOKEN_SECRET ?? 'workshop-dev-secret';

function encode(payload: TokenPayload): string {
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
}

function decode(token: string): TokenPayload {
  const parsed = Buffer.from(token, 'base64url').toString('utf8');
  return JSON.parse(parsed) as TokenPayload;
}

function sign(rawPayload: string): string {
  return crypto.createHmac('sha256', SECRET).update(rawPayload).digest('base64url');
}

export function issueToken(payload: Omit<TokenPayload, 'exp'>, expiresInSeconds = 60 * 60): string {
  const fullPayload: TokenPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  };

  const encodedPayload = encode(fullPayload);
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function verifyToken(token: string): TokenPayload {
  const [encodedPayload, receivedSignature] = token.split('.');
  if (!encodedPayload || !receivedSignature) {
    throw new Error('Malformed token');
  }

  const expectedSignature = sign(encodedPayload);
  if (receivedSignature !== expectedSignature) {
    throw new Error('Invalid token signature');
  }

  const payload = decode(encodedPayload);
  if (payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Token expired');
  }

  return payload;
}
