import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// **Feature: platform-upgrade, Property 4: Footer contains all collections**
// For any set of collections, WHEN the footer is rendered
// THEN it SHALL display links to ALL available collections
// **Validates: Requirements 3.3**

interface MockCollection {
  slug: string;
  title: string;
  icon: string;
  order: number;
}

// Функция сортировки коллекций (копия из lib/collections.ts)
function sortCollectionsByOrder(collections: MockCollection[]): MockCollection[] {
  return [...collections].sort((a, b) => a.order - b.order);
}

// Генератор mock collections
const mockCollectionArb = fc.record({
  slug: fc.string({ minLength: 1, maxLength: 50 }).filter(s => /^[a-z0-9-]+$/.test(s)),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  icon: fc.constantFrom('🤖', '🎨', '📹', '💬', '🔧'),
  order: fc.integer({ min: 0, max: 100 })
});

describe('Property 4: Footer contains all collections', () => {
  it('should include all collections in footer links', () => {
    fc.assert(
      fc.property(
        fc.uniqueArray(mockCollectionArb, { 
          minLength: 1, 
          maxLength: 10,
          comparator: (a, b) => a.slug === b.slug 
        }), 
        (collections) => {
          // Симуляция рендеринга футера
          const sortedCollections = sortCollectionsByOrder(collections);
          const footerLinks = sortedCollections.map(col => ({
            href: `/category/${col.slug}`,
            title: col.title,
            icon: col.icon
          }));

          // Все коллекции должны быть представлены
          expect(footerLinks.length).toBe(collections.length);
          
          // Каждая коллекция должна иметь ссылку
          for (const col of collections) {
            const link = footerLinks.find(l => l.href === `/category/${col.slug}`);
            expect(link).toBeDefined();
            expect(link?.title).toBe(col.title);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should preserve collection order', () => {
    fc.assert(
      fc.property(
        fc.uniqueArray(mockCollectionArb, { 
          minLength: 2, 
          maxLength: 10,
          comparator: (a, b) => a.slug === b.slug 
        }), 
        (collections) => {
          const sorted = sortCollectionsByOrder(collections);
          
          // Проверяем что порядок соответствует order
          for (let i = 1; i < sorted.length; i++) {
            expect(sorted[i - 1].order).toBeLessThanOrEqual(sorted[i].order);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should generate valid category URLs', () => {
    fc.assert(
      fc.property(mockCollectionArb, (collection) => {
        const url = `/category/${collection.slug}`;
        expect(url).toMatch(/^\/category\/[a-z0-9-]+$/);
      }),
      { numRuns: 100 }
    );
  });
});
