import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

describe('No Hardcoded Colors Property Tests', () => {
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

  // Exceptions: PlaceholderImage uses rgba for SVG pattern with very low opacity
  const exceptions = ['PlaceholderImage.astro'];

  it('should not have hardcoded rgb() colors in component styles', () => {
    const violations: string[] = [];
    
    for (const file of astroFiles) {
      const filename = file.split('/').pop() || '';
      if (exceptions.includes(filename)) continue;
      
      const content = readFileSync(file, 'utf-8');
      const styleMatch = content.match(/<style[^>]*>([\s\S]*?)<\/style>/);
      if (!styleMatch) continue;
      
      const styleContent = styleMatch[1];
      // Match rgb(number, number, number) but not rgb(var(...))
      const hardcodedRgb = styleContent.match(/rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/g);
      
      if (hardcodedRgb) {
        violations.push(`${filename}: ${hardcodedRgb.join(', ')}`);
      }
    }
    
    expect(violations).toEqual([]);
  });

  it('should not have hardcoded rgba() colors in component styles', () => {
    const violations: string[] = [];
    
    for (const file of astroFiles) {
      const filename = file.split('/').pop() || '';
      if (exceptions.includes(filename)) continue;
      
      const content = readFileSync(file, 'utf-8');
      const styleMatch = content.match(/<style[^>]*>([\s\S]*?)<\/style>/);
      if (!styleMatch) continue;
      
      const styleContent = styleMatch[1];
      // Match rgba(number, number, number, number) but not rgba(var(...), number)
      const hardcodedRgba = styleContent.match(/rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)/g);
      
      if (hardcodedRgba) {
        violations.push(`${filename}: ${hardcodedRgba.join(', ')}`);
      }
    }
    
    expect(violations).toEqual([]);
  });

  it('should not have hardcoded hex colors in component styles (except brand colors)', () => {
    const violations: string[] = [];
    // white and black are acceptable
    const allowedHex = ['#fff', '#ffffff', '#000', '#000000'];
    
    for (const file of astroFiles) {
      const filename = file.split('/').pop() || '';
      if (exceptions.includes(filename)) continue;
      
      const content = readFileSync(file, 'utf-8');
      const styleMatch = content.match(/<style[^>]*>([\s\S]*?)<\/style>/);
      if (!styleMatch) continue;
      
      const styleContent = styleMatch[1];
      const hexColors = styleContent.match(/#[0-9a-fA-F]{3,8}\b/g);
      
      if (hexColors) {
        const disallowed = hexColors.filter(c => !allowedHex.includes(c.toLowerCase()));
        if (disallowed.length > 0) {
          violations.push(`${filename}: ${disallowed.join(', ')}`);
        }
      }
    }
    
    expect(violations).toEqual([]);
  });
});
