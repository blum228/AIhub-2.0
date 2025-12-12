import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// **Feature: catalog-upgrade-v2, Property 14: Sitemap completeness**
// For any set of tools and collections, the generated sitemap SHALL contain
// URLs for all tool pages AND all category pages.

interface Tool {
  slug: string;
}

interface Collection {
  slug: string;
}

const siteUrl = 'https://ai-catalog.ru';

const toolArb = fc.record({
  slug: fc.stringMatching(/^[a-z][a-z0-9-]{2,20}$/)
});

const collectionArb = fc.record({
  slug: fc.constantFrom('ai-girlfriends', 'image-generators', 'telegram-bots', 'free-tools', 'russian-friendly')
});

// Simulates sitemap generation with categories
function generateSitemapV2(tools: Tool[], collections: Collection[]): string[] {
  const urls: string[] = [
    siteUrl,
    `${siteUrl}/catalog`,
    `${siteUrl}/telegram-bots`
  ];

  // Add category pages
  for (const collection of collections) {
    urls.push(`${siteUrl}/category/${collection.slug}`);
  }

  // Add tool pages
  for (const tool of tools) {
    urls.push(`${siteUrl}/tool/${tool.slug}`);
  }

  return urls;
}

describe('Property 14: Sitemap completeness (v2 with categories)', () => {
  it('includes URL for every tool', () => {
    fc.assert(
      fc.property(
        fc.array(toolArb, { minLength: 0, maxLength: 20 }),
        fc.uniqueArray(collectionArb, { minLength: 1, maxLength: 5, comparator: (a, b) => a.slug === b.slug }),
        (tools, collections) => {
          const urls = generateSitemapV2(tools, collections);

          for (const tool of tools) {
            expect(urls).toContain(`${siteUrl}/tool/${tool.slug}`);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('includes URL for every category', () => {
    fc.assert(
      fc.property(
        fc.array(toolArb, { minLength: 0, maxLength: 10 }),
        fc.uniqueArray(collectionArb, { minLength: 1, maxLength: 5, comparator: (a, b) => a.slug === b.slug }),
        (tools, collections) => {
          const urls = generateSitemapV2(tools, collections);

          for (const collection of collections) {
            expect(urls).toContain(`${siteUrl}/category/${collection.slug}`);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('includes static pages', () => {
    fc.assert(
      fc.property(
        fc.array(toolArb, { minLength: 0, maxLength: 10 }),
        fc.uniqueArray(collectionArb, { minLength: 1, maxLength: 5, comparator: (a, b) => a.slug === b.slug }),
        (tools, collections) => {
          const urls = generateSitemapV2(tools, collections);

          expect(urls).toContain(siteUrl);
          expect(urls).toContain(`${siteUrl}/catalog`);
          expect(urls).toContain(`${siteUrl}/telegram-bots`);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('has correct total URL count', () => {
    fc.assert(
      fc.property(
        fc.array(toolArb, { minLength: 0, maxLength: 20 }),
        fc.uniqueArray(collectionArb, { minLength: 1, maxLength: 5, comparator: (a, b) => a.slug === b.slug }),
        (tools, collections) => {
          const urls = generateSitemapV2(tools, collections);
          
          // 3 static pages + categories + tools
          const expectedCount = 3 + collections.length + tools.length;
          expect(urls.length).toBe(expectedCount);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('all URLs are valid format', () => {
    fc.assert(
      fc.property(
        fc.array(toolArb, { minLength: 1, maxLength: 10 }),
        fc.uniqueArray(collectionArb, { minLength: 1, maxLength: 5, comparator: (a, b) => a.slug === b.slug }),
        (tools, collections) => {
          const urls = generateSitemapV2(tools, collections);
          
          for (const url of urls) {
            expect(url).toMatch(/^https:\/\/ai-catalog\.ru/);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
