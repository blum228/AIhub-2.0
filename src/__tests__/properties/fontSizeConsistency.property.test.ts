import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// **Feature: ux-design-audit, Property 4: Font Size Consistency**
// Component styles SHALL NOT use clamp() for font-size.
// Standard IDS font sizes should be used instead.
// Validates: Requirements 11.1, 11.2, 11.4

const COMPONENTS_DIR = path.join(process.cwd(), 'src/components');
const PAGES_DIR = path.join(process.cwd(), 'src/pages');

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
  
  if (filePath.endsWith('.css')) {
    return content;
  }
  
  return '';
}

function findClampFontSize(styleContent: string): { line: number; content: string }[] {
  const violations: { line: number; content: string }[] = [];
  const lines = styleContent.split('\n');
  
  lines.forEach((line, index) => {
    if (/font-size:\s*clamp\(/i.test(line)) {
      violations.push({
        line: index + 1,
        content: line.trim()
      });
    }
  });
  
  return violations;
}

describe('Property 4: Font Size Consistency', () => {
  it('should not use clamp() for font-size in components', () => {
    const componentFiles = findFilesRecursively(COMPONENTS_DIR, ['.astro']);
    const violations: { file: string; issues: { line: number; content: string }[] }[] = [];
    
    for (const file of componentFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const styleContent = extractStyleContent(content, file);
      const clampIssues = findClampFontSize(styleContent);
      
      if (clampIssues.length > 0) {
        violations.push({
          file: path.relative(process.cwd(), file),
          issues: clampIssues
        });
      }
    }
    
    if (violations.length > 0) {
      const message = violations.map(v => 
        `${v.file}:\n${v.issues.map(i => `  Line ${i.line}: ${i.content}`).join('\n')}`
      ).join('\n\n');
      
      expect.fail(`Found clamp() in font-size:\n\n${message}`);
    }
  });

  it('should not use clamp() for font-size in pages', () => {
    const pageFiles = findFilesRecursively(PAGES_DIR, ['.astro']);
    const violations: { file: string; issues: { line: number; content: string }[] }[] = [];
    
    for (const file of pageFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const styleContent = extractStyleContent(content, file);
      const clampIssues = findClampFontSize(styleContent);
      
      if (clampIssues.length > 0) {
        violations.push({
          file: path.relative(process.cwd(), file),
          issues: clampIssues
        });
      }
    }
    
    if (violations.length > 0) {
      const message = violations.map(v => 
        `${v.file}:\n${v.issues.map(i => `  Line ${i.line}: ${i.content}`).join('\n')}`
      ).join('\n\n');
      
      expect.fail(`Found clamp() in font-size:\n\n${message}`);
    }
  });
});
