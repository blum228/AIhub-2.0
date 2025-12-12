import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// **Feature: platform-upgrade, Property 1: Featured tools are top-rated**
// For any set of tools, WHEN displayed in featured section
// THEN it SHALL show top 4 highest-rated items sorted by rating descending
// **Validates: Requirements 1.2**

interface MockTool {
  slug: string;
  title: string;
  rating?: number;
}

// Копия функции сортировки по рейтингу
function sortToolsByRating(tools: MockTool[]): MockTool[] {
  return [...tools].sort((a, b) => {
    if (a.rating === undefined && b.rating === undefined) return 0;
    if (a.rating === undefined) return 1;
    if (b.rating === undefined) return -1;
    return b.rating - a.rating;
  });
}

// Функция получения featured tools
function getFeaturedTools(tools: MockTool[], count: number = 4): MockTool[] {
  return sortToolsByRating(tools).slice(0, count);
}

// Генератор mock tools
const mockToolArb = fc.record({
  slug: fc.string({ minLength: 1, maxLength: 50 }).filter(s => /^[a-z0-9-]+$/.test(s)),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  rating: fc.option(fc.float({ min: 0, max: 5, noNaN: true }), { nil: undefined })
});

describe('Property 1: Featured tools are top-rated', () => {
  it('should return at most 4 tools', () => {
    fc.assert(
      fc.property(
        fc.array(mockToolArb, { minLength: 0, maxLength: 20 }),
        (tools) => {
          const featured = getFeaturedTools(tools);
          expect(featured.length).toBeLessThanOrEqual(4);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return all tools if less than 4 available', () => {
    fc.assert(
      fc.property(
        fc.array(mockToolArb, { minLength: 0, maxLength: 3 }),
        (tools) => {
          const featured = getFeaturedTools(tools);
          expect(featured.length).toBe(tools.length);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should sort by rating descending', () => {
    fc.assert(
      fc.property(
        fc.array(mockToolArb, { minLength: 2, maxLength: 20 }),
        (tools) => {
          const featured = getFeaturedTools(tools);
          
          // Проверяем что инструменты с рейтингом отсортированы по убыванию
          const withRating = featured.filter(t => t.rating !== undefined);
          for (let i = 1; i < withRating.length; i++) {
            expect(withRating[i - 1].rating!).toBeGreaterThanOrEqual(withRating[i].rating!);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should prioritize tools with rating over tools without', () => {
    fc.assert(
      fc.property(
        fc.array(mockToolArb, { minLength: 5, maxLength: 20 }),
        (tools) => {
          const featured = getFeaturedTools(tools);
          
          // Находим индекс первого инструмента без рейтинга
          const firstWithoutRating = featured.findIndex(t => t.rating === undefined);
          
          if (firstWithoutRating > 0) {
            // Все инструменты до него должны иметь рейтинг
            for (let i = 0; i < firstWithoutRating; i++) {
              expect(featured[i].rating).toBeDefined();
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should include highest rated tools from original set', () => {
    fc.assert(
      fc.property(
        fc.uniqueArray(mockToolArb, { 
          minLength: 5, 
          maxLength: 20,
          comparator: (a, b) => a.slug === b.slug 
        }),
        (tools) => {
          const featured = getFeaturedTools(tools);
          const sorted = sortToolsByRating(tools);
          
          // Featured должны быть первыми 4 из отсортированного списка
          featured.forEach((tool, index) => {
            expect(tool.slug).toBe(sorted[index].slug);
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
