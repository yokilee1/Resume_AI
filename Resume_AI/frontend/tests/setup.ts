import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';

// Add any global mocks here if needed (e.g. for window.matchMedia)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});
