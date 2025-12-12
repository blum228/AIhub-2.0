import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { sortToolsByRating } from '../../lib/tools';

// **Feature: ai-catalog-cis, Property 1: Tool sorting by rating**
// For any list of tools with ratings, when displayed on the homepage,
// the tools SHALL be ordered by rating in descending order (highest first).

const toolWithRatingArb = fc.record({
  slug: fc.string({ minLength: 1 }),
  rating: fc.option(fc.float({ min: 0, max: 5, noNaN: true }), { nil: undefined })
});

describe('Property 1: Tool sorting by rating', () => {
  it('should sort tools by rating in descending order', () => {
    fc.assert(
      fc.property(fc.array(toolWithRatingArb, { minLength: 0, maxLength: 50 }), (tools) => {
        const sorted = sortToolsByRating(tools);

        // Проверяем что длина сохранилась
        expect(sorted.length).toBe(tools.length);

        // Проверяем порядок: инструменты с рейтингом идут по убыванию
        for (let i = 0; i < sorted.length - 1; i++) {
          const current = sorted[i].rating;
          const next = sorted[i + 1].rating;

          if (current !== undefined && next !== undefined) {
            expect(current).toBeGreaterThanOrEqual(next);
          }
          // Если текущий без рейтинга, следующий тоже должен быть без рейтинга
          if (current === undefined) {
            expect(next).toBeUndefined();
          }
        }
      }),
      { numRuns: 100 }
    );
  });

  it('should place tools without rating at the end', () => {
    fc.assert(
      fc.property(fc.array(toolWithRatingArb, { minLength: 1, maxLength: 50 }), (tools) => {
        const sorted = sortToolsByRating(tools);
        const firstUndefinedIndex = sorted.findIndex(t => t.rating === undefined);

        if (firstUndefinedIndex !== -1) {
          // Все после первого undefined тоже должны быть undefined
          for (let i = firstUndefinedIndex; i < sorted.length; i++) {
            expect(sorted[i].rating).toBeUndefined();
          }
        }
      }),
      { numRuns: 100 }
    );
  });

  it('should not mutate original array', () => {
    fc.assert(
      fc.property(fc.array(toolWithRatingArb, { minLength: 1, maxLength: 20 }), (tools) => {
        const original = [...tools];
        sortToolsByRating(tools);
        expect(tools).toEqual(original);
      }),
      { numRuns: 100 }
    );
  });
});
