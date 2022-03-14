// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
import crypto from 'crypto';

Object.defineProperty(global.self, 'crypto', {
  value: {
    // @ts-ignore
    subtle: crypto.webcrypto.subtle,
    getRandomValues: (arr: Uint8Array | Uint16Array | Uint32Array) =>
      crypto.randomBytes(arr.length),
    randomUUID: crypto.randomUUID,
  },
});
