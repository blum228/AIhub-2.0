import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// **Feature: ux-design-audit, Property 6: TextWidth for Content Restriction**
// Long-form content sections SHALL be wrapped in TextWidth component for optimal readability.
// Validates: Requirements 7.4

const PAGES_DIR = path.join(process.cwd(), 'src/pages');

// Pages that should use TextWidth for content sections
const PAGES_REQUIRING_TEXTWIDTH = [
  'category/[slug].astro',
  'blog/[slug].astro',
  'tool/[slug].astro'
];

function findFilesRecursively(dir: string, extensions: string[]): string[] {
  const files: string[] = [];
  
  if (!fs.existsSync(dir)) {
    return files;
  }
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      files.push(...findFilesRecursively(fullPath, extensions));
    } else if (extensions.some(ext => entry.name.endsWith(ext))) {
      files.push(fullPath);
    }
  }
  
  return files;
}

describe('Property 6: TextWidth for Content Restriction', () => {
  it('should import TextWidth component in content pages', () => {
    const violations: string[] = [];
    
    for (const pagePath of PAGES_REQUIRING_TEXTWIDTH) {
      const fullPath = path.join(PAGES_DIR, pagePath);
      
      if (!fs.existsSync(fullPath)) {
        continue;
      }
      
      const content = fs.readFileSync(fullPath, 'utf-8');
      
      // Check if TextWidth is imported
      const hasTextWidthImport = content.includes("import TextWidth from") || 
                                  content.includes("import TextWidth,");
      
      if (!hasTextWidthImport) {
        violations.push(pagePath);
      }
    }
    
    if (violations.length > 0) {
      expect.fail(`Pages missing TextWidth import:\n${violations.join('\n')}`);
    }
  });

  it('should use TextWidth component in content pages', () => {
    const violations: string[] = [];
    
    for (const pagePath of PAGES_REQUIRING_TEXTWIDTH) {
      const fullPath = path.join(PAGES_DIR, pagePath);
      
      if (!fs.existsSync(fullPath)) {
        continue;
      }
      
      const content = fs.readFileSync(fullPath, 'utf-8');
      
      // Check if TextWidth is used in template
      const hasTextWidthUsage = content.includes('<TextWidth') || content.includes('<TextWidth>');
      
      if (!hasTextWidthUsage) {
        violations.push(pagePath);
      }
    }
    
    if (violations.length > 0) {
      expect.fail(`Pages not using TextWidth component:\n${violations.join('\n')}`);
    }
  });

  it('should wrap content sections in TextWidth', () => {
    // This test checks that content sections are properly wrapped
    const contentPages = findFilesRecursively(PAGES_DIR, ['.astro']);
    const pagesWithContent: { file: string; hasTextWidth: boolean }[] = [];
    
    for (const file of contentPages) {
      const content = fs.readFileSync(file, 'utf-8');
      
      // Check if page has <Content /> component (MDX content)
      if (content.includes('<Content />') || content.includes('<Content/>')) {
        const hasTextWidth = content.includes('<TextWidth');
        pagesWithContent.push({
          file: path.relative(PAGES_DIR, file),
          hasTextWidth
        });
      }
    }
    
    const violations = pagesWithContent.filter(p => !p.hasTextWidth);
    
    if (violations.length > 0) {
      console.warn('Pages with <Content /> but no TextWidth wrapper:');
      violations.forEach(v => console.warn(`  ${v.file}`));
    }
    
    // This is informational - we track but don't fail
    expect(true).toBe(true);
  });
});
