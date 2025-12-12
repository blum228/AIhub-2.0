import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// **Feature: ux-design-audit, Property 5: Rounded Components Use IDS Radius**
// Rounded components SHALL use default IDS radius (var(--ids__radius)) instead of custom values.
// Validates: Requirements 4.1, 5.2

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

function findCustomRadiusInRounded(content: string): { line: number; content: string }[] {
  const violations: { line: number; content: string }[] = [];
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    // Check for <Rounded radius="..."> with custom values
    if (/<Rounded[^>]*radius\s*=\s*["'][^"']+["']/i.test(line)) {
      violations.push({
        line: index + 1,
        content: line.trim()
      });
    }
  });
  
  return violations;
}

describe('Property 5: Rounded Components Use IDS Radius', () => {
  it('should not use custom radius in Rounded components in component files', () => {
    const componentFiles = findFilesRecursively(COMPONENTS_DIR, ['.astro']);
    const violations: { file: string; issues: { line: number; content: string }[] }[] = [];
    
    for (const file of componentFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const customRadiusIssues = findCustomRadiusInRounded(content);
      
      if (customRadiusIssues.length > 0) {
        violations.push({
          file: path.relative(process.cwd(), file),
          issues: customRadiusIssues
        });
      }
    }
    
    if (violations.length > 0) {
      const message = violations.map(v => 
        `${v.file}:\n${v.issues.map(i => `  Line ${i.line}: ${i.content}`).join('\n')}`
      ).join('\n\n');
      
      expect.fail(`Found custom radius in Rounded components:\n\n${message}`);
    }
  });

  it('should not use custom radius in Rounded components in page files', () => {
    const pageFiles = findFilesRecursively(PAGES_DIR, ['.astro']);
    const violations: { file: string; issues: { line: number; content: string }[] }[] = [];
    
    // Exclude demo pages that intentionally show custom radius examples
    const excludedFiles = ['ids-demo.astro'];
    
    for (const file of pageFiles) {
      const fileName = path.basename(file);
      if (excludedFiles.includes(fileName)) {
        continue;
      }
      
      const content = fs.readFileSync(file, 'utf-8');
      const customRadiusIssues = findCustomRadiusInRounded(content);
      
      if (customRadiusIssues.length > 0) {
        violations.push({
          file: path.relative(process.cwd(), file),
          issues: customRadiusIssues
        });
      }
    }
    
    if (violations.length > 0) {
      const message = violations.map(v => 
        `${v.file}:\n${v.issues.map(i => `  Line ${i.line}: ${i.content}`).join('\n')}`
      ).join('\n\n');
      
      expect.fail(`Found custom radius in Rounded components:\n\n${message}`);
    }
  });
});
