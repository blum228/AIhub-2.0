import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Color Tokens Property Tests', () => {
  const colorsPath = join(process.cwd(), 'src/styles/colors.css');
  const colorsContent = readFileSync(colorsPath, 'utf-8');

  const requiredTokens = [
    '--ids__text-RGB',
    '--ids__muted-RGB',
    '--ids__surface-RGB',
  ];

  it('should define core tokens in colors.css', () => {
    for (const token of requiredTokens) {
      expect(colorsContent).toContain(token);
    }
  });

  it('should have valid RGB format for tokens', () => {
    const rgbPattern = /--ids__[\w-]+-RGB:\s*\d{1,3},\s*\d{1,3},\s*\d{1,3}/g;
    const matches = colorsContent.match(rgbPattern);
    expect(matches!.length).toBeGreaterThan(5);
  });
});
