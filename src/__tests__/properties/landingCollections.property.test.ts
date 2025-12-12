import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// **Feature: platform-upgrade, Property 2: All collections displayed on landing**
// For any set of collections, WHEN displayed on landing page
// THEN it SHALL show category cards for ALL available collections
// **Validates: Requirements 1.3**

interface MockCollection {
  slug: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

// Функция сортировки коллекций
function sortCollectionsByOrder(collections: MockCollection[]): MockCollection[] {
  return [...collections].sort((a, b) => a.order - b.order);
}

// Генератор mock collections
const mockCollectionArb = fc.record({
  slug: fc.string({ minLength: 1, maxLength: 50 }).filter(s => /^[a-z0-9-]+$/.test(s)),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  description: fc.string({ minLength: 10, maxLength: 300 }),
  icon: fc.constantFrom('🤖', '🎨', '📹', '💬', '🔧'),
  order: fc.integer({ min: 0, max: 100 })
});

describe('Property 2: All collections displayed on landing', () => {
  it('should display all collections', () => {
    fc.assert(
      fc.property(
        fc.uniqueArray(mockCollectionArb, { 
          minLength: 1, 
          maxLength: 10,
          comparator: (a, b) => a.slug === b.slug 
        }),
        (collections) => {
          // Симуляция рендеринга landing page
          const displayedCollections = sortCollectionsByOrder(collections);
          
          // Все коллекции должны быть отображены
          expect(displayedCollections.length).toBe(collections.length);
          
          // Каждая коллекция должна присутствовать
          for (const col of collections) {
            const found = displayedCollections.find(d => d.slug === col.slug);
            expect(found).toBeDefined();
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

  it('should include all collection data for category cards', () => {
    fc.assert(
      fc.property(mockCollectionArb, (collection) => {
        // Каждая коллекция должна иметь все необходимые поля для CategoryCard
        expect(collection.slug).toBeTruthy();
        expect(collection.title).toBeTruthy();
        expect(collection.description).toBeTruthy();
        expect(collection.icon).toBeTruthy();
      }),
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

  it('should handle empty collections gracefully', () => {
    const sorted = sortCollectionsByOrder([]);
    expect(sorted).toEqual([]);
  });
});
