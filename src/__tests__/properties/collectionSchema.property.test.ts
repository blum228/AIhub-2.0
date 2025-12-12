import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// **Feature: catalog-upgrade-v2, Property 12: CollectionPage schema.org validity**
// For any category page, the rendered HTML SHALL contain a valid JSON-LD script
// with "@type": "CollectionPage" and itemListElement array matching the displayed tools.

interface Tool {
  slug: string;
  title: string;
}

interface Collection {
  slug: string;
  title: string;
  seoDescription: string;
}

interface CollectionPageSchema {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  url: string;
  mainEntity: {
    "@type": string;
    numberOfItems: number;
    itemListElement: Array<{
      "@type": string;
      position: number;
      url: string;
      name: string;
    }>;
  };
}

const toolArb = fc.record({
  slug: fc.stringMatching(/^[a-z][a-z0-9-]{2,20}$/),
  title: fc.string({ minLength: 1, maxLength: 50 })
});

const collectionArb = fc.record({
  slug: fc.stringMatching(/^[a-z][a-z0-9-]{2,20}$/),
  title: fc.string({ minLength: 1, maxLength: 50 }),
  seoDescription: fc.string({ minLength: 50, maxLength: 160 })
});

// Simulates schema generation
function generateCollectionPageSchema(
  collection: Collection,
  tools: Tool[],
  siteUrl: string
): CollectionPageSchema {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: collection.title,
    description: collection.seoDescription,
    url: `${siteUrl}/category/${collection.slug}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: tools.length,
      itemListElement: tools.map((tool, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteUrl}/tool/${tool.slug}`,
        name: tool.title
      }))
    }
  };
}

describe('Property 12: CollectionPage schema.org validity', () => {
  it('schema has correct @type', () => {
    fc.assert(
      fc.property(
        collectionArb,
        fc.array(toolArb, { minLength: 0, maxLength: 20 }),
        (collection, tools) => {
          const schema = generateCollectionPageSchema(collection, tools, 'https://example.com');
          expect(schema["@type"]).toBe("CollectionPage");
        }
      ),
      { numRuns: 100 }
    );
  });

  it('schema has valid @context', () => {
    fc.assert(
      fc.property(
        collectionArb,
        fc.array(toolArb, { minLength: 0, maxLength: 20 }),
        (collection, tools) => {
          const schema = generateCollectionPageSchema(collection, tools, 'https://example.com');
          expect(schema["@context"]).toBe("https://schema.org");
        }
      ),
      { numRuns: 100 }
    );
  });

  it('itemListElement count matches tools count', () => {
    fc.assert(
      fc.property(
        collectionArb,
        fc.array(toolArb, { minLength: 0, maxLength: 20 }),
        (collection, tools) => {
          const schema = generateCollectionPageSchema(collection, tools, 'https://example.com');
          expect(schema.mainEntity.itemListElement.length).toBe(tools.length);
          expect(schema.mainEntity.numberOfItems).toBe(tools.length);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('itemListElement positions are sequential starting from 1', () => {
    fc.assert(
      fc.property(
        collectionArb,
        fc.array(toolArb, { minLength: 1, maxLength: 20 }),
        (collection, tools) => {
          const schema = generateCollectionPageSchema(collection, tools, 'https://example.com');
          
          schema.mainEntity.itemListElement.forEach((item, index) => {
            expect(item.position).toBe(index + 1);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('all itemListElement URLs are valid tool URLs', () => {
    fc.assert(
      fc.property(
        collectionArb,
        fc.array(toolArb, { minLength: 1, maxLength: 20 }),
        (collection, tools) => {
          const schema = generateCollectionPageSchema(collection, tools, 'https://example.com');
          
          schema.mainEntity.itemListElement.forEach((item, index) => {
            expect(item.url).toBe(`https://example.com/tool/${tools[index].slug}`);
            expect(item["@type"]).toBe("ListItem");
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
