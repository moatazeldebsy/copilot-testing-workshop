import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'node:util';

if (!global.TextEncoder) {
	global.TextEncoder = TextEncoder;
}

if (!global.TextDecoder) {
	global.TextDecoder = TextDecoder as typeof global.TextDecoder;
}

// Express 5's router uses setImmediate to defer error propagation.
// jsdom doesn't include setImmediate, so polyfill it for API tests.
if (typeof setImmediate === 'undefined') {
  (global as Record<string, unknown>).setImmediate = (fn: (...args: unknown[]) => void, ...args: unknown[]) =>
    setTimeout(fn, 0, ...args);
}