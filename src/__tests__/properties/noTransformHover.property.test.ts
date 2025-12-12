import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// **Feature: ux-design-audit, Property 2: No Transform Animations on Hover**
// Component styles SHALL NOT use transform animations on hover states.
// This ensures visual consistency with IDS design system which avoids motion effects.
// Validates: Requirements 4.4, 8.1, 8.2, 8.4

const COMPONENTS_DIR = path.join(process.cwd(), 'src/components');
const PAGES_DIR = path.join(process.cwd(), 'src/pages');

// Patterns for transform on hover
const TRANSFORM_HOVER_PATTERNS = [
  /transform:\s*scale\(/gi,
  /transform:\s*translateY\(/gi,
  /transform:\s*translateX\(/gi,
  /transform:\s*translate\(/gi,
  /transform:\s*rotate\(/gi,
  /transform:\s*skew\(/gi
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

function findTransformInHoverRules(styleContent: string): { rule: string; line: number }[] {
  const violations: { rule: string; line: number }[] = [];
  const lines = styleContent.split('\n');
  
  let inHoverRule = false;
  let braceCount = 0;
  let currentRule = '';
  let ruleStartLine = 0;
  
  lines.forEach((line, index) => {
    // Check if entering a :hover rule
    if (line.includes(':hover')) {
      inHoverRule = true;
      currentRule = line;
      ruleStartLine = index + 1;
      braceCount = (line.match(/{/g) || []).length - (line.match(/}/g) || []).length;
    } else if (inHoverRule) {
      currentRule += '\n' + line;
      braceCount += (line.match(/{/g) || []).length - (line.match(/}/g) || []).length;
      
      // Check for transform properties
      for (const pattern of TRANSFORM_HOVER_PATTERNS) {
        pattern.lastIndex = 0;
        if (pattern.test(line)) {
          violations.push({
            rule: line.trim(),
            line: index + 1
          });
        }
      }
      
      // Exit hover rule when braces are balanced
      if (braceCount <= 0) {
        inHoverRule = false;
        currentRule = '';
      }
    }
  });
  
  return violations;
}

describe('Property 2: No Transform Animations on Hover', () => {
  it('should not use transform on hover in component styles', () => {
    const componentFiles = findFilesRecursively(COMPONENTS_DIR, ['.astro']);
    const violations: { file: string; transforms: { rule: string; line: number }[] }[] = [];
    
    for (const file of componentFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const styleContent = extractStyleContent(content, file);
      const transforms = findTransformInHoverRules(styleContent);
      
      if (transforms.length > 0) {
        violations.push({
          file: path.relative(process.cwd(), file),
          transforms
        });
      }
    }
    
    if (violations.length > 0) {
      const message = violations.map(v => 
        `${v.file}:\n${v.transforms.map(t => `  Line ${t.line}: ${t.rule}`).join('\n')}`
      ).join('\n\n');
      
      expect.fail(`Found transform animations on hover:\n\n${message}`);
    }
  });

  it('should not use transform on hover in page styles', () => {
    const pageFiles = findFilesRecursively(PAGES_DIR, ['.astro']);
    const violations: { file: string; transforms: { rule: string; line: number }[] }[] = [];
    
    for (const file of pageFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const styleContent = extractStyleContent(content, file);
      const transforms = findTransformInHoverRules(styleContent);
      
      if (transforms.length > 0) {
        violations.push({
          file: path.relative(process.cwd(), file),
          transforms
        });
      }
    }
    
    if (violations.length > 0) {
      const message = violations.map(v => 
        `${v.file}:\n${v.transforms.map(t => `  Line ${t.line}: ${t.rule}`).join('\n')}`
      ).join('\n\n');
      
      expect.fail(`Found transform animations on hover:\n\n${message}`);
    }
  });
});
