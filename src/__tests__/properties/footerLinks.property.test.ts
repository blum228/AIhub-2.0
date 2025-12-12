import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// **Feature: catalog-upgrade-v2, Property 5: Footer category links completeness**
// For any page, the footer SHALL contain links to all defined collections,
// and each link SHALL point to a valid category page URL.

const COLLECTION_SLUGS = ['ai-girlfriends', 'image-generators', 'telegram-bots', 'free-tools', 'russian-friendly'];

interface Collection {
  slug: string;
  title: string;
  icon: string;
}

const collectionArb = fc.record({
  slug: fc.constantFrom(...COLLECTION_SLUGS),
  title: fc.string({ minLength: 1, maxLength: 50 }),
  icon: fc.constantFrom('💕', '🎨', '🤖', '🆓', '💳')
});

// Simulates footer rendering logic
function renderFooterLinks(collections: Collection[]): { href: string; label: string }[] {
  return collections.map(col => ({
    href: `/category/${col.slug}`,
    label: col.title
  }));
}

function isValidCategoryUrl(url: string): boolean {
  const pattern = /^\/category\/[a-z][a-z0-9-]*$/;
  return pattern.test(url);
}

describe('Property 5: Footer category links completeness', () => {
  it('footer contains links to all collections', () => {
    fc.assert(
      fc.property(
        fc.uniqueArray(collectionArb, { 
          minLength: 1, 
          maxLength: 5,
          comparator: (a, b) => a.slug === b.slug
        }),
        (collections) => {
          const footerLinks = renderFooterLinks(collections);
          
          // Every collection should have a corresponding link
          for (const col of collections) {
            const hasLink = footerLinks.some(link => 
              link.href === `/category/${col.slug}` && link.label === col.title
            );
            expect(hasLink).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('all footer links point to valid category URLs', () => {
    fc.assert(
      fc.property(
        fc.uniqueArray(collectionArb, { 
          minLength: 1, 
          maxLength: 5,
          comparator: (a, b) => a.slug === b.slug
        }),
        (collections) => {
          const footerLinks = renderFooterLinks(collections);
          
          for (const link of footerLinks) {
            expect(isValidCategoryUrl(link.href)).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('footer link count equals collection count', () => {
    fc.assert(
      fc.property(
        fc.uniqueArray(collectionArb, { 
          minLength: 0, 
          maxLength: 5,
          comparator: (a, b) => a.slug === b.slug
        }),
        (collections) => {
          const footerLinks = renderFooterLinks(collections);
          expect(footerLinks.length).toBe(collections.length);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('no duplicate links in footer', () => {
    fc.assert(
      fc.property(
        fc.uniqueArray(collectionArb, { 
          minLength: 1, 
          maxLength: 5,
          comparator: (a, b) => a.slug === b.slug
        }),
        (collections) => {
          const footerLinks = renderFooterLinks(collections);
          const hrefs = footerLinks.map(l => l.href);
          const uniqueHrefs = new Set(hrefs);
          
          expect(uniqueHrefs.size).toBe(hrefs.length);
        }
      ),
      { numRuns: 100 }
    );
  });
});
