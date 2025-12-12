import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// **Feature: ux-design-audit, Property 3: No Gradients in Styles**
// Component styles SHALL NOT use CSS gradients (linear-gradient, radial-gradient, conic-gradient).
// This ensures visual consistency with IDS design system.
// Validates: Requirements 8.3

const COMPONENTS_DIR = path.join(process.cwd(), 'src/components');
const PAGES_DIR = path.join(process.cwd(), 'src/pages');
const STYLES_DIR = path.join(process.cwd(), 'src/styles');

const GRADIENT_PATTERNS = [
  /linear-gradient\s*\(/gi,
  /radial-gradient\s*\(/gi,
  /conic-gradient\s*\(/gi,
  /repeating-linear-gradient\s*\(/gi,
  /repeating-radial-gradient\s*\(/gi,
  /repeating-conic-gradient\s*\(/gi
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

function extractStyleContent(content: string, filePath: string): string {
  // For .astro files, extract content from <style> tags
  if (filePath.endsWith('.astro')) {
    const styleMatches = content.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
    if (styleMatches) {
      return styleMatches.map(match => {
        const inner = match.replace(/<style[^>]*>/i, '').replace(/<\/style>/i, '');
        return inner;
      }).join('\n');
    }
    return '';
  }
  
  // For .css files, return entire content
  if (filePath.endsWith('.css')) {
    return content;
  }
  
  return '';
}

function findGradients(styleContent: string): { pattern: string; line: number }[] {
  const gradients: { pattern: string; line: number }[] = [];
  const lines = styleContent.split('\n');
  
  lines.forEach((line, index) => {
    for (const pattern of GRADIENT_PATTERNS) {
      pattern.lastIndex = 0; // Reset regex state
      if (pattern.test(line)) {
        gradients.push({
          pattern: line.trim(),
          line: index + 1
        });
      }
    }
  });
  
  return gradients;
}

describe('Property 3: No Gradients in Styles', () => {
  it('should not use gradients in component styles', () => {
    const componentFiles = findFilesRecursively(COMPONENTS_DIR, ['.astro']);
    const violations: { file: string; gradients: { pattern: string; line: number }[] }[] = [];
    
    for (const file of componentFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const styleContent = extractStyleContent(content, file);
      const gradients = findGradients(styleContent);
      
      if (gradients.length > 0) {
        violations.push({
          file: path.relative(process.cwd(), file),
          gradients
        });
      }
    }
    
    if (violations.length > 0) {
      const message = violations.map(v => 
        `${v.file}:\n${v.gradients.map(g => `  Line ${g.line}: ${g.pattern}`).join('\n')}`
      ).join('\n\n');
      
      expect.fail(`Found gradients in component styles:\n\n${message}`);
    }
  });

  it('should not use gradients in page styles', () => {
    const pageFiles = findFilesRecursively(PAGES_DIR, ['.astro']);
    const violations: { file: string; gradients: { pattern: string; line: number }[] }[] = [];
    
    for (const file of pageFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const styleContent = extractStyleContent(content, file);
      const gradients = findGradients(styleContent);
      
      if (gradients.length > 0) {
        violations.push({
          file: path.relative(process.cwd(), file),
          gradients
        });
      }
    }
    
    if (violations.length > 0) {
      const message = violations.map(v => 
        `${v.file}:\n${v.gradients.map(g => `  Line ${g.line}: ${g.pattern}`).join('\n')}`
      ).join('\n\n');
      
      expect.fail(`Found gradients in page styles:\n\n${message}`);
    }
  });

  it('should not use gradients in global CSS files', () => {
    const cssFiles = findFilesRecursively(STYLES_DIR, ['.css']);
    const violations: { file: string; gradients: { pattern: string; line: number }[] }[] = [];
    
    for (const file of cssFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const gradients = findGradients(content);
      
      if (gradients.length > 0) {
        violations.push({
          file: path.relative(process.cwd(), file),
          gradients
        });
      }
    }
    
    if (violations.length > 0) {
      const message = violations.map(v => 
        `${v.file}:\n${v.gradients.map(g => `  Line ${g.line}: ${g.pattern}`).join('\n')}`
      ).join('\n\n');
      
      expect.fail(`Found gradients in CSS files:\n\n${message}`);
    }
  });
});
