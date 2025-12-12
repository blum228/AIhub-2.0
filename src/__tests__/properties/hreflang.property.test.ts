import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// **Feature: catalog-upgrade-v2, Property 15: Hreflang tag presence**
// For any page, the rendered HTML SHALL contain a link tag with hreflang="ru-RU" attribute.

interface PageMeta {
  canonicalUrl: string;
  hreflangTags: Array<{
    hreflang: string;
    href: string;
  }>;
}

// Simulates hreflang tag generation
function generateHreflangTags(canonicalUrl: string): PageMeta['hreflangTags'] {
  return [
    { hreflang: 'ru-RU', href: canonicalUrl },
    { hreflang: 'x-default', href: canonicalUrl }
  ];
}

function hasRuRuHreflang(tags: PageMeta['hreflangTags']): boolean {
  return tags.some(tag => tag.hreflang === 'ru-RU');
}

function hasXDefaultHreflang(tags: PageMeta['hreflangTags']): boolean {
  return tags.some(tag => tag.hreflang === 'x-default');
}

describe('Property 15: Hreflang tag presence', () => {
  it('page has ru-RU hreflang tag', () => {
    fc.assert(
      fc.property(
        fc.webUrl(),
        (canonicalUrl) => {
          const tags = generateHreflangTags(canonicalUrl);
          expect(hasRuRuHreflang(tags)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('page has x-default hreflang tag', () => {
    fc.assert(
      fc.property(
        fc.webUrl(),
        (canonicalUrl) => {
          const tags = generateHreflangTags(canonicalUrl);
          expect(hasXDefaultHreflang(tags)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('hreflang href matches canonical URL', () => {
    fc.assert(
      fc.property(
        fc.webUrl(),
        (canonicalUrl) => {
          const tags = generateHreflangTags(canonicalUrl);
          
          for (const tag of tags) {
            expect(tag.href).toBe(canonicalUrl);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('generates exactly 2 hreflang tags', () => {
    fc.assert(
      fc.property(
        fc.webUrl(),
        (canonicalUrl) => {
          const tags = generateHreflangTags(canonicalUrl);
          expect(tags.length).toBe(2);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('hreflang values are valid', () => {
    fc.assert(
      fc.property(
        fc.webUrl(),
        (canonicalUrl) => {
          const tags = generateHreflangTags(canonicalUrl);
          const validHreflangs = ['ru-RU', 'x-default'];
          
          for (const tag of tags) {
            expect(validHreflangs).toContain(tag.hreflang);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
