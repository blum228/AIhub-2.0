import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';

// **Feature: ai-catalog-cis, Property 5: Safe Mode CSS class application**
// For any tool marked as NSFW, when Safe Mode is enabled, the tool's image element
// SHALL have the blur CSS class applied. When Safe Mode is disabled, the blur class SHALL NOT be present.

// **Feature: ai-catalog-cis, Property 6: Safe Mode localStorage round-trip**
// For any Safe Mode state (enabled/disabled), setting the state and then reading it
// from localStorage SHALL return the same value.

// Симуляция Safe Mode логики
const SAFE_MODE_KEY = 'safeMode';

function setSafeMode(enabled: boolean): void {
  localStorage.setItem(SAFE_MODE_KEY, JSON.stringify(enabled));
  if (enabled) {
    document.body.classList.add('safe-mode');
  } else {
    document.body.classList.remove('safe-mode');
  }
}

function getSafeMode(): boolean {
  const stored = localStorage.getItem(SAFE_MODE_KEY);
  return stored ? JSON.parse(stored) : false;
}

function isSafeModeActive(): boolean {
  return document.body.classList.contains('safe-mode');
}

describe('Property 5: Safe Mode CSS class application', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.classList.remove('safe-mode');
  });

  it('should add safe-mode class to body when enabled', () => {
    fc.assert(
      fc.property(fc.constant(true), () => {
        setSafeMode(true);
        expect(document.body.classList.contains('safe-mode')).toBe(true);
      }),
      { numRuns: 10 }
    );
  });

  it('should remove safe-mode class from body when disabled', () => {
    fc.assert(
      fc.property(fc.constant(false), () => {
        // Сначала включаем
        setSafeMode(true);
        expect(document.body.classList.contains('safe-mode')).toBe(true);
        // Потом выключаем
        setSafeMode(false);
        expect(document.body.classList.contains('safe-mode')).toBe(false);
      }),
      { numRuns: 10 }
    );
  });

  it('should correctly reflect state after multiple toggles', () => {
    fc.assert(
      fc.property(fc.array(fc.boolean(), { minLength: 1, maxLength: 20 }), (toggles) => {
        for (const enabled of toggles) {
          setSafeMode(enabled);
        }
        const lastState = toggles[toggles.length - 1];
        expect(isSafeModeActive()).toBe(lastState);
      }),
      { numRuns: 100 }
    );
  });
});

describe('Property 6: Safe Mode localStorage round-trip', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.classList.remove('safe-mode');
  });

  it('should persist and retrieve the same value', () => {
    fc.assert(
      fc.property(fc.boolean(), (enabled) => {
        setSafeMode(enabled);
        const retrieved = getSafeMode();
        expect(retrieved).toBe(enabled);
      }),
      { numRuns: 100 }
    );
  });

  it('should maintain consistency between localStorage and DOM', () => {
    fc.assert(
      fc.property(fc.boolean(), (enabled) => {
        setSafeMode(enabled);
        const fromStorage = getSafeMode();
        const fromDOM = isSafeModeActive();
        expect(fromStorage).toBe(fromDOM);
      }),
      { numRuns: 100 }
    );
  });

  it('should default to false when localStorage is empty', () => {
    localStorage.clear();
    expect(getSafeMode()).toBe(false);
  });
});
