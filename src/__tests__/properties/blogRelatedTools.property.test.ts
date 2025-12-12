import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// **Feature: platform-upgrade, Property 9: Related tools displayed**
// For any blog post with relatedTools, WHEN displayed on article page
// THEN it SHALL display tool cards for referenced tools, skipping non-existent ones
// **Validates: Requirements 5.4**

interface MockTool {
  slug: string;
  title: string;
  shortDescription: string;
  coverImage: string;
  priceModel: 'free' | 'freemium' | 'paid';
  tags: string[];
  isNsfw: boolean;
  affiliateLink: string;
}

// Генератор mock tools
const mockToolArb = fc.record({
  slug: fc.string({ minLength: 1, maxLength: 50 }).filter(s => /^[a-z0-9-]+$/.test(s)),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  shortDescription: fc.string({ minLength: 10, maxLength: 200 }),
  coverImage: fc.constant('/images/tools/cover.jpg'),
  priceModel: fc.constantFrom('free', 'freemium', 'paid') as fc.Arbitrary<'free' | 'freemium' | 'paid'>,
  tags: fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 5 }),
  isNsfw: fc.boolean(),
  affiliateLink: fc.constant('https://example.com')
});

// Функция фильтрации related tools (копия логики из [slug].astro)
function getRelatedToolsData(
  relatedToolSlugs: string[] | undefined,
  allTools: MockTool[]
): MockTool[] {
  if (!relatedToolSlugs || relatedToolSlugs.length === 0) {
    return [];
  }
  
  return relatedToolSlugs
    .map(slug => allTools.find(t => t.slug === slug))
    .filter((t): t is MockTool => t !== undefined);
}

describe('Property 9: Related tools displayed', () => {
  it('should return empty array when no related tools specified', () => {
    fc.assert(
      fc.property(
        fc.array(mockToolArb, { minLength: 1, maxLength: 10 }),
        (allTools) => {
          const result = getRelatedToolsData(undefined, allTools);
          expect(result).toEqual([]);
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should return empty array when related tools array is empty', () => {
    fc.assert(
      fc.property(
        fc.array(mockToolArb, { minLength: 1, maxLength: 10 }),
        (allTools) => {
          const result = getRelatedToolsData([], allTools);
          expect(result).toEqual([]);
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should return matching tools when they exist', () => {
    fc.assert(
      fc.property(
        fc.uniqueArray(mockToolArb, { 
          minLength: 3, 
          maxLength: 10,
          comparator: (a, b) => a.slug === b.slug 
        }),
        (allTools) => {
          // Выбираем случайные slugs из существующих
          const existingSlugs = allTools.slice(0, 2).map(t => t.slug);
          const result = getRelatedToolsData(existingSlugs, allTools);
          
          expect(result.length).toBe(existingSlugs.length);
          result.forEach(tool => {
            expect(existingSlugs).toContain(tool.slug);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should skip non-existent tools gracefully', () => {
    fc.assert(
      fc.property(
        fc.uniqueArray(mockToolArb, { 
          minLength: 2, 
          maxLength: 10,
          comparator: (a, b) => a.slug === b.slug 
        }),
        (allTools) => {
          const existingSlug = allTools[0].slug;
          const nonExistentSlug = 'non-existent-tool-slug-xyz';
          
          const result = getRelatedToolsData([existingSlug, nonExistentSlug], allTools);
          
          // Должен вернуть только существующий инструмент
          expect(result.length).toBe(1);
          expect(result[0].slug).toBe(existingSlug);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should preserve order of related tools', () => {
    fc.assert(
      fc.property(
        fc.uniqueArray(mockToolArb, { 
          minLength: 3, 
          maxLength: 10,
          comparator: (a, b) => a.slug === b.slug 
        }),
        (allTools) => {
          const slugs = allTools.slice(0, 3).map(t => t.slug);
          const result = getRelatedToolsData(slugs, allTools);
          
          // Порядок должен соответствовать порядку в relatedTools
          result.forEach((tool, index) => {
            expect(tool.slug).toBe(slugs[index]);
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
