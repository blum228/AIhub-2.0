import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Badge Neutral Tokens Property Tests', () => {
  const accessBadgesPath = join(process.cwd(), 'src/components/catalog/AccessBadges.astro');
  const paymentBadgesPath = join(process.cwd(), 'src/components/catalog/PaymentBadges.astro');
  
  const accessBadgesContent = readFileSync(accessBadgesPath, 'utf-8');
  const paymentBadgesContent = readFileSync(paymentBadgesPath, 'utf-8');

  describe('AccessBadges.astro', () => {
    it('should use IDS tokens for colors', () => {
      expect(accessBadgesContent).toContain('--ids__');
    });

    it('should not have hardcoded rgb colors in badge styles', () => {
      const styleSection = accessBadgesContent.match(/<style>([\s\S]*?)<\/style>/)?.[1] || '';
      const hardcodedRgb = styleSection.match(/rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/g);
      expect(hardcodedRgb).toBeNull();
    });

    it('should not have dark mode overrides for badge colors', () => {
      expect(accessBadgesContent).not.toContain('@media (prefers-color-scheme: dark)');
    });
  });

  describe('PaymentBadges.astro', () => {
    it('should use IDS tokens for colors', () => {
      expect(paymentBadgesContent).toContain('--ids__');
    });

    it('should not have hardcoded rgb colors in badge styles', () => {
      const styleSection = paymentBadgesContent.match(/<style>([\s\S]*?)<\/style>/)?.[1] || '';
      const hardcodedRgb = styleSection.match(/rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/g);
      expect(hardcodedRgb).toBeNull();
    });

    it('should not have dark mode overrides for badge colors', () => {
      expect(paymentBadgesContent).not.toContain('@media (prefers-color-scheme: dark)');
    });
  });
});
