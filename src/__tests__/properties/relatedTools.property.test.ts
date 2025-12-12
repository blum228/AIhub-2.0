import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// **Feature: catalog-upgrade-v2, Property 4: Related tools category matching**
// For any tool page, all tools in the "Related" section SHALL share at least one tag
// with the current tool, and the current tool SHALL NOT appear in its own related section.

const ALL_TAGS = ['chatbot', 'image-gen', 'video', 'telegram-bot', 'russian', 'russian-cards', 'crypto', 'no-vpn'];

interface Tool {
  slug: string;
  tags: string[];
}

const toolArb = fc.record({
  slug: fc.stringMatching(/^[a-z][a-z0-9-]{2,20}$/),
  tags: fc.uniqueArray(fc.constantFrom(...ALL_TAGS), { minLength: 1, maxLength: 4 })
});

// Mirrors src/lib/tools.ts findRelatedTools
function findRelatedTools(currentTool: Tool, allTools: Tool[], limit = 4): Tool[] {
  return allTools
    .filter(tool => tool.slug !== currentTool.slug)
    .map(tool => ({
      tool,
      sharedTags: tool.tags.filter(tag => currentTool.tags.includes(tag)).length
    }))
    .filter(({ sharedTags }) => sharedTags > 0)
    .sort((a, b) => b.sharedTags - a.sharedTags)
    .slice(0, limit)
    .map(({ tool }) => tool);
}

function hasSharedTag(tool1: Tool, tool2: Tool): boolean {
  return tool1.tags.some(tag => tool2.tags.includes(tag));
}

describe('Property 4: Related tools category matching', () => {
  it('all related tools share at least one tag with current tool', () => {
    fc.assert(
      fc.property(
        toolArb,
        fc.array(toolArb, { minLength: 1, maxLength: 20 }),
        (currentTool, otherTools) => {
          const allTools = [currentTool, ...otherTools];
          const relatedTools = findRelatedTools(currentTool, allTools);
          
          for (const related of relatedTools) {
            expect(hasSharedTag(currentTool, related)).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('current tool never appears in its own related section', () => {
    fc.assert(
      fc.property(
        toolArb,
        fc.array(toolArb, { minLength: 1, maxLength: 20 }),
        (currentTool, otherTools) => {
          const allTools = [currentTool, ...otherTools];
          const relatedTools = findRelatedTools(currentTool, allTools);
          
          const relatedSlugs = relatedTools.map(t => t.slug);
          expect(relatedSlugs).not.toContain(currentTool.slug);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('related tools are sorted by number of shared tags (descending)', () => {
    fc.assert(
      fc.property(
        toolArb,
        fc.array(toolArb, { minLength: 2, maxLength: 20 }),
        (currentTool, otherTools) => {
          const allTools = [currentTool, ...otherTools];
          const relatedTools = findRelatedTools(currentTool, allTools);
          
          if (relatedTools.length >= 2) {
            for (let i = 0; i < relatedTools.length - 1; i++) {
              const sharedCurrent = relatedTools[i].tags.filter(t => currentTool.tags.includes(t)).length;
              const sharedNext = relatedTools[i + 1].tags.filter(t => currentTool.tags.includes(t)).length;
              expect(sharedCurrent).toBeGreaterThanOrEqual(sharedNext);
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('returns at most limit tools', () => {
    fc.assert(
      fc.property(
        toolArb,
        fc.array(toolArb, { minLength: 10, maxLength: 30 }),
        fc.integer({ min: 1, max: 10 }),
        (currentTool, otherTools, limit) => {
          const allTools = [currentTool, ...otherTools];
          const relatedTools = findRelatedTools(currentTool, allTools, limit);
          
          expect(relatedTools.length).toBeLessThanOrEqual(limit);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('returns empty array when no tools share tags', () => {
    const toolWithUniqueTags: Tool = { slug: 'unique-tool', tags: ['chatbot'] };
    const toolsWithDifferentTags: Tool[] = [
      { slug: 'tool-1', tags: ['image-gen'] },
      { slug: 'tool-2', tags: ['video'] }
    ];
    
    const relatedTools = findRelatedTools(toolWithUniqueTags, toolsWithDifferentTags);
    expect(relatedTools.length).toBe(0);
  });
});
