import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { filterToolsByTags } from '../../lib/tools';

// **Feature: ai-catalog-cis, Property 3: Tag filtering with AND logic**
// For any list of tools and any non-empty set of selected tags,
// the filtered result SHALL contain only tools that have ALL selected tags.
// When the tag set is empty, all tools SHALL be returned.

const ALL_TAGS = ['chatbot', 'image-gen', 'video', 'telegram-bot', 'russian', 'russian-cards', 'crypto', 'no-vpn'];

const toolArb = fc.record({
  slug: fc.string({ minLength: 1 }),
  tags: fc.uniqueArray(fc.constantFrom(...ALL_TAGS), { minLength: 1, maxLength: 5 })
});

const tagSetArb = fc.uniqueArray(fc.constantFrom(...ALL_TAGS), { minLength: 0, maxLength: 4 });

describe('Property 3: Tag filtering with AND logic', () => {
  it('should return only tools that have ALL selected tags', () => {
    fc.assert(
      fc.property(
        fc.array(toolArb, { minLength: 0, maxLength: 30 }),
        tagSetArb,
        (tools, selectedTags) => {
          const filtered = filterToolsByTags(tools, selectedTags);

          // Каждый отфильтрованный инструмент должен содержать ВСЕ выбранные теги
          for (const tool of filtered) {
            for (const tag of selectedTags) {
              expect(tool.tags).toContain(tag);
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return all tools when tag set is empty', () => {
    fc.assert(
      fc.property(fc.array(toolArb, { minLength: 0, maxLength: 30 }), (tools) => {
        const filtered = filterToolsByTags(tools, []);
        expect(filtered).toEqual(tools);
      }),
      { numRuns: 100 }
    );
  });

  it('should not include tools missing any selected tag', () => {
    fc.assert(
      fc.property(
        fc.array(toolArb, { minLength: 1, maxLength: 30 }),
        fc.uniqueArray(fc.constantFrom(...ALL_TAGS), { minLength: 1, maxLength: 4 }),
        (tools, selectedTags) => {
          const filtered = filterToolsByTags(tools, selectedTags);
          const filteredSlugs = new Set(filtered.map(t => t.slug));

          // Инструменты без хотя бы одного тега не должны попасть в результат
          for (const tool of tools) {
            const hasAllTags = selectedTags.every(tag => tool.tags.includes(tag));
            if (!hasAllTags) {
              expect(filteredSlugs.has(tool.slug)).toBe(false);
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should preserve original order', () => {
    fc.assert(
      fc.property(
        fc.array(toolArb, { minLength: 0, maxLength: 30 }),
        tagSetArb,
        (tools, selectedTags) => {
          const filtered = filterToolsByTags(tools, selectedTags);
          const filteredSlugs = filtered.map(t => t.slug);
          const originalOrder = tools.filter(t => filteredSlugs.includes(t.slug)).map(t => t.slug);
          expect(filteredSlugs).toEqual(originalOrder);
        }
      ),
      { numRuns: 100 }
    );
  });
});
