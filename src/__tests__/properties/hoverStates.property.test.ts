import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

describe('Hover States Property Tests', () => {
  const componentsDir = join(process.cwd(), 'src/components');
  
  function getAllAstroFiles(dir: string): string[] {
    const files: string[] = [];
    const entries = readdirSync(dir);
    
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...getAllAstroFiles(fullPath));
      } else if (entry.endsWith('.astro')) {
        files.push(fullPath);
      }
    }
    return files;
  }

  const astroFiles = getAllAstroFiles(componentsDir);

  it('should use IDS tokens for hover state colors', () => {
    const violations: string[] = [];
    
    for (const file of astroFiles) {
      const filename = file.split('/').pop() || '';
      const content = readFileSync(file, 'utf-8');
      const styleMatch = content.match(/<style[^>]*>([\s\S]*?)<\/style>/);
      if (!styleMatch) continue;
      
      const styleContent = styleMatch[1];
      
      // Find all :hover rules
      const hoverRules = styleContent.match(/[^}]*:hover[^{]*\{[^}]*\}/g);
      if (!hoverRules) continue;
      
      for (const rule of hoverRules) {
        // Check for hardcoded colors in hover rules
        const hardcodedRgb = rule.match(/rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/g);
        const hardcodedRgba = rule.match(/rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)/g);
        const hardcodedHex = rule.match(/#[0-9a-fA-F]{3,8}\b/g);
        
        const allHardcoded = [
          ...(hardcodedRgb || []),
          ...(hardcodedRgba || []),
          ...(hardcodedHex || []).filter(c => !['#fff', '#ffffff', '#000', '#000000'].includes(c.toLowerCase()))
        ];
        
        if (allHardcoded.length > 0) {
          violations.push(`${filename}: ${allHardcoded.join(', ')}`);
        }
      }
    }
    
    expect(violations).toEqual([]);
  });

  it('should have hover states use CSS variables', () => {
    const componentsWithHover: string[] = [];
    
    for (const file of astroFiles) {
      const filename = file.split('/').pop() || '';
      const content = readFileSync(file, 'utf-8');
      const styleMatch = content.match(/<style[^>]*>([\s\S]*?)<\/style>/);
      if (!styleMatch) continue;
      
      const styleContent = styleMatch[1];
      
      if (styleContent.includes(':hover')) {
        // Check that hover rules use var() for colors
        const hoverRules = styleContent.match(/[^}]*:hover[^{]*\{[^}]*\}/g);
        if (hoverRules) {
          const usesVars = hoverRules.some(rule => rule.includes('var(--ids__'));
          if (usesVars) {
            componentsWithHover.push(filename);
          }
        }
      }
    }
    
    // At least some components should use IDS tokens in hover states
    expect(componentsWithHover.length).toBeGreaterThan(0);
  });
});
