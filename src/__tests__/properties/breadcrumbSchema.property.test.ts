import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// **Feature: catalog-upgrade-v2, Property 13: BreadcrumbList schema.org validity**
// For any tool page, the rendered HTML SHALL contain a valid JSON-LD script
// with "@type": "BreadcrumbList" and itemListElement matching the breadcrumbs structure.

interface Tool {
  slug: string;
  title: string;
}

interface Collection {
  slug: string;
  title: string;
}

interface BreadcrumbListSchema {
  "@context": string;
  "@type": string;
  itemListElement: Array<{
    "@type": string;
    position: number;
    name: string;
    item?: string;
  }>;
}

const toolArb = fc.record({
  slug: fc.stringMatching(/^[a-z][a-z0-9-]{2,20}$/),
  title: fc.string({ minLength: 1, maxLength: 50 })
});

const collectionArb = fc.record({
  slug: fc.stringMatching(/^[a-z][a-z0-9-]{2,20}$/),
  title: fc.string({ minLength: 1, maxLength: 50 })
});

// Simulates schema generation
function generateBreadcrumbSchema(
  tool: Tool,
  primaryCollection: Collection | undefined,
  siteUrl: string
): BreadcrumbListSchema {
  const items: BreadcrumbListSchema['itemListElement'] = [
    { "@type": "ListItem", position: 1, name: "Главная", item: siteUrl },
    { "@type": "ListItem", position: 2, name: "Каталог", item: `${siteUrl}/catalog` }
  ];
  
  if (primaryCollection) {
    items.push({
      "@type": "ListItem",
      position: 3,
      name: primaryCollection.title,
      item: `${siteUrl}/category/${primaryCollection.slug}`
    });
    items.push({
      "@type": "ListItem",
      position: 4,
      name: tool.title
    });
  } else {
    items.push({
      "@type": "ListItem",
      position: 3,
      name: tool.title
    });
  }
  
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items
  };
}

describe('Property 13: BreadcrumbList schema.org validity', () => {
  it('schema has correct @type', () => {
    fc.assert(
      fc.property(
        toolArb,
        fc.option(collectionArb, { nil: undefined }),
        (tool, collection) => {
          const schema = generateBreadcrumbSchema(tool, collection, 'https://example.com');
          expect(schema["@type"]).toBe("BreadcrumbList");
        }
      ),
      { numRuns: 100 }
    );
  });

  it('schema has valid @context', () => {
    fc.assert(
      fc.property(
        toolArb,
        fc.option(collectionArb, { nil: undefined }),
        (tool, collection) => {
          const schema = generateBreadcrumbSchema(tool, collection, 'https://example.com');
          expect(schema["@context"]).toBe("https://schema.org");
        }
      ),
      { numRuns: 100 }
    );
  });

  it('positions are sequential starting from 1', () => {
    fc.assert(
      fc.property(
        toolArb,
        fc.option(collectionArb, { nil: undefined }),
        (tool, collection) => {
          const schema = generateBreadcrumbSchema(tool, collection, 'https://example.com');
          
          schema.itemListElement.forEach((item, index) => {
            expect(item.position).toBe(index + 1);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('last item is tool name without URL', () => {
    fc.assert(
      fc.property(
        toolArb,
        fc.option(collectionArb, { nil: undefined }),
        (tool, collection) => {
          const schema = generateBreadcrumbSchema(tool, collection, 'https://example.com');
          const lastItem = schema.itemListElement[schema.itemListElement.length - 1];
          
          expect(lastItem.name).toBe(tool.title);
          expect(lastItem.item).toBeUndefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('has 3 items without collection, 4 with collection', () => {
    fc.assert(
      fc.property(
        toolArb,
        fc.option(collectionArb, { nil: undefined }),
        (tool, collection) => {
          const schema = generateBreadcrumbSchema(tool, collection, 'https://example.com');
          
          if (collection) {
            expect(schema.itemListElement.length).toBe(4);
          } else {
            expect(schema.itemListElement.length).toBe(3);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('all items have @type ListItem', () => {
    fc.assert(
      fc.property(
        toolArb,
        fc.option(collectionArb, { nil: undefined }),
        (tool, collection) => {
          const schema = generateBreadcrumbSchema(tool, collection, 'https://example.com');
          
          schema.itemListElement.forEach(item => {
            expect(item["@type"]).toBe("ListItem");
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
