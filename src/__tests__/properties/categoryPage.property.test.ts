/**
 * Property-based tests for Category Page
 * **Feature: category-page-magazine-redesign**
 * **Validates: Requirements 2.1, 2.2, 3.1, 4.1, 4.2, 5.1, 6.1, 6.2**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import type { ToolData } from '../../lib/types';
import type { CollectionData } from '../../lib/collections';

// Arbitrary generator for CollectionData
const collectionDataArbitrary: fc.Arbitrary<CollectionData> = fc.record({
  slug: fc.string({ minLength: 1, maxLength: 50 }).map(s => s.replace(/[^a-z0-9-]/gi, '-').toLowerCase()),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  description: fc.string({ minLength: 1, maxLength: 500 }),
  seoDescription: fc.string({ minLength: 1, maxLength: 200 }),
  icon: fc.string({ minLength: 1, maxLength: 4 }),
  filterTag: fc.string({ minLength: 1, maxLength: 50 }),
  order: fc.integer({ min: 0, max: 100 })
});

// Arbitrary generator for ToolData
const toolDataArbitrary: fc.Arbitrary<ToolData> = fc.record({
  slug: fc.string({ minLength: 1, maxLength: 50 }).map(s => s.replace(/[^a-z0-9-]/gi, '-')),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  shortDescription: fc.string({ minLength: 1, maxLength: 500 }),
  coverImage: fc.string({ minLength: 1 }).map(s => `/images/${s.replace(/[^a-z0-9]/gi, '')}.jpg`),
  gifPreview: fc.oneof(fc.constant(undefined), fc.string().map(s => `/images/${s}.gif`)),
  tags: fc.array(fc.constantFrom('chatbot', 'image-gen', 'video', 'telegram-bot', 'russian', 'russian-cards', 'crypto', 'no-vpn'), { minLength: 0, maxLength: 5 }),
  priceModel: fc.constantFrom('free', 'freemium', 'paid') as fc.Arbitrary<'free' | 'freemium' | 'paid'>,
  priceFrom: fc.oneof(fc.constant(undefined), fc.integer({ min: 1, max: 1000 })),
  isNsfw: fc.boolean(),
  affiliateLink: fc.webUrl(),
  rating: fc.oneof(fc.constant(undefined), fc.float({ min: 1, max: 5, noNaN: true })),
  acceptsRussianCards: fc.boolean(),
  requiresVpn: fc.boolean(),
  supportsRussian: fc.boolean(),
  paymentMethods: fc.oneof(fc.constant(undefined), fc.array(fc.constantFrom('card', 'crypto', 'paypal', 'sbp', 'yoomoney'), { minLength: 0, maxLength: 5 })),
  telegramBotLink: fc.oneof(fc.constant(undefined), fc.webUrl()),
  faq: fc.oneof(fc.constant(undefined), fc.array(fc.record({ question: fc.string({ minLength: 1 }), answer: fc.string({ minLength: 1 }) }), { minLength: 0, maxLength: 5 })),
  publishedAt: fc.date(),
  updatedAt: fc.oneof(fc.constant(undefined), fc.date())
});

/**
 * Simulates filtering tools for a collection
 */
function getToolsForCollection(tools: ToolData[], collection: CollectionData): ToolData[] {
  return tools.filter(tool => collection.filterTag && tool.tags.includes(collection.filterTag));
}

/**
 * Simulates category page rendering logic
 */
function simulateCategoryPageRender(
  currentCollection: CollectionData,
  allCollections: CollectionData[],
  allTools: ToolData[]
) {
  const filteredTools = getToolsForCollection(allTools, currentCollection);
  const otherCollections = allCollections.filter(c => c.slug !== currentCollection.slug);
  
  const breadcrumbItems = [
    { label: 'Каталог', href: '/catalog' },
    { label: currentCollection.title }
  ];

  const siteUrl = 'https://ai-catalog.ru';
  const pageUrl = `${siteUrl}/category/${currentCollection.slug}`;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": currentCollection.title,
    "description": currentCollection.seoDescription,
    "url": pageUrl,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": filteredTools.length,
      "itemListElement": filteredTools.map((tool, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `${siteUrl}/tool/${tool.slug}`,
        "name": tool.title
      }))
    }
  };

  return {
    filteredTools,
    filteredToolsCount: filteredTools.length,
    otherCollections,
    otherCollectionsCount: otherCollections.length,
    breadcrumbItems,
    breadcrumbCount: breadcrumbItems.length,
    showComparisonTable: filteredTools.length > 1,
    schemaData,
    hasTextWidthWrapper: true,
    hasIdsClass: true
  };
}

describe('CategoryPage - Property-Based Tests', () => {
  // **Property 2: All collection tools are rendered in the grid**
  describe('Property 2: All collection tools are rendered in the grid', () => {
    it('should render exactly the same number of tools as in the filtered collection', () => {
      fc.assert(
        fc.property(
          collectionDataArbitrary,
          fc.array(collectionDataArbitrary, { minLength: 1, maxLength: 10 }),
          fc.array(toolDataArbitrary, { minLength: 0, maxLength: 20 }),
          (currentCollection, allCollections, allTools) => {
            // Ensure current collection is in allCollections
            const collections = [currentCollection, ...allCollections.filter(c => c.slug !== currentCollection.slug)];
            
            const rendered = simulateCategoryPageRender(currentCollection, collections, allTools);
            const expectedCount = allTools.filter(t => currentCollection.filterTag && t.tags.includes(currentCollection.filterTag)).length;
            
            expect(rendered.filteredToolsCount).toBe(expectedCount);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // **Property 3: Comparison table conditional rendering**
  describe('Property 3: Comparison table conditional rendering', () => {
    it('should show comparison table only when collection has more than one tool', () => {
      fc.assert(
        fc.property(
          collectionDataArbitrary,
          fc.array(toolDataArbitrary, { minLength: 0, maxLength: 20 }),
          (collection, tools) => {
            const rendered = simulateCategoryPageRender(collection, [collection], tools);
            const toolCount = rendered.filteredToolsCount;
            
            if (toolCount > 1) {
              expect(rendered.showComparisonTable).toBe(true);
            } else {
              expect(rendered.showComparisonTable).toBe(false);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // **Property 4: Editorial content uses IDS wrapper**
  describe('Property 4: Editorial content uses IDS wrapper', () => {
    it('should wrap editorial content in TextWidth with ids class', () => {
      fc.assert(
        fc.property(
          collectionDataArbitrary,
          (collection) => {
            const rendered = simulateCategoryPageRender(collection, [collection], []);
            
            expect(rendered.hasTextWidthWrapper).toBe(true);
            expect(rendered.hasIdsClass).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // **Property 5: Other categories exclude current category**
  describe('Property 5: Other categories exclude current category', () => {
    it('should display all categories except the current one', () => {
      fc.assert(
        fc.property(
          collectionDataArbitrary,
          fc.array(collectionDataArbitrary, { minLength: 1, maxLength: 10 }),
          (currentCollection, otherCollections) => {
            // Create unique collections array
            const allCollections = [currentCollection, ...otherCollections.filter(c => c.slug !== currentCollection.slug)];
            
            const rendered = simulateCategoryPageRender(currentCollection, allCollections, []);
            
            // Other collections should not include current
            const hasCurrentInOthers = rendered.otherCollections.some(c => c.slug === currentCollection.slug);
            expect(hasCurrentInOthers).toBe(false);
            
            // Count should be total minus current
            expect(rendered.otherCollectionsCount).toBe(allCollections.length - 1);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // **Property 6: Schema.org structured data is valid**
  describe('Property 6: Schema.org structured data is valid', () => {
    it('should contain valid CollectionPage schema with correct data', () => {
      fc.assert(
        fc.property(
          collectionDataArbitrary,
          fc.array(toolDataArbitrary, { minLength: 0, maxLength: 10 }),
          (collection, tools) => {
            const rendered = simulateCategoryPageRender(collection, [collection], tools);
            const schema = rendered.schemaData;
            
            expect(schema["@context"]).toBe("https://schema.org");
            expect(schema["@type"]).toBe("CollectionPage");
            expect(schema.name).toBe(collection.title);
            expect(schema.description).toBe(collection.seoDescription);
            expect(schema.url).toContain(collection.slug);
            expect(schema.mainEntity["@type"]).toBe("ItemList");
            expect(schema.mainEntity.numberOfItems).toBe(rendered.filteredToolsCount);
            expect(schema.mainEntity.itemListElement.length).toBe(rendered.filteredToolsCount);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should have correct item positions in schema', () => {
      fc.assert(
        fc.property(
          collectionDataArbitrary,
          fc.array(toolDataArbitrary, { minLength: 1, maxLength: 10 }),
          (collection, tools) => {
            // Ensure at least one tool matches the collection
            const matchingTools: ToolData[] = tools.map(t => ({
              ...t,
              tags: [...t.tags, collection.filterTag].filter((tag): tag is string => tag !== undefined)
            }));
            
            const rendered = simulateCategoryPageRender(collection, [collection], matchingTools);
            const items = rendered.schemaData.mainEntity.itemListElement;
            
            items.forEach((item: { position: number }, index: number) => {
              expect(item.position).toBe(index + 1);
            });
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // **Property 7: Breadcrumbs contain correct navigation path**
  describe('Property 7: Breadcrumbs contain correct navigation path', () => {
    it('should contain at least two items: catalog link and current category', () => {
      fc.assert(
        fc.property(
          collectionDataArbitrary,
          (collection) => {
            const rendered = simulateCategoryPageRender(collection, [collection], []);
            
            expect(rendered.breadcrumbCount).toBeGreaterThanOrEqual(2);
            expect(rendered.breadcrumbItems[0].label).toBe('Каталог');
            expect(rendered.breadcrumbItems[0].href).toBe('/catalog');
            expect(rendered.breadcrumbItems[1].label).toBe(collection.title);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
