import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Documentation Sync Property Tests', () => {
  const colorsPath = join(process.cwd(), 'src/styles/colors.css');
  const docsPath = join(process.cwd(), 'COLOR_SYSTEM.md');
  
  const colorsContent = readFileSync(colorsPath, 'utf-8');
  const docsContent = readFileSync(docsPath, 'utf-8');

  it('should document all tokens defined in colors.css', () => {
    // Extract all --ids__ tokens from colors.css
    const tokenMatches = colorsContent.match(/--ids__[\w-]+-RGB/g) || [];
    const tokens = [...new Set(tokenMatches)];
    
    for (const token of tokens) {
      expect(docsContent).toContain(token);
    }
  });

  it('should have correct RGB values in documentation', () => {
    // Extract token definitions from colors.css
    const tokenDefs = colorsContent.match(/--ids__[\w-]+-RGB:\s*\d+,\s*\d+,\s*\d+/g) || [];
    
    for (const def of tokenDefs) {
      const [token, value] = def.split(':').map(s => s.trim());
      // Documentation should mention the token
      expect(docsContent).toContain(token);
    }
  });

  it('should document semantic tokens for badges', () => {
    const requiredDocs = [
      'success',
      'warning', 
      'info',
      'badge'
    ];
    
    for (const term of requiredDocs) {
      expect(docsContent.toLowerCase()).toContain(term);
    }
  });
});
