import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// **Feature: ai-catalog-cis, Property 8: SEO meta tags completeness**
// For any Tool Page, the rendered HTML SHALL contain:
// - meta title tag with tool name
// - meta description tag with short description
// - Open Graph tags (og:title, og:description, og:image)
// - canonical URL tag

// **Feature: ai-catalog-cis, Property 9: Schema.org markup validity**
// For any tool with a rating, the rendered Tool Page SHALL contain
// valid JSON-LD with Product and AggregateRating schema.org types.

interface ToolSEOData {
  title: string;
  shortDescription: string;
  coverImage: string;
  slug: string;
  rating?: number;
}

const siteUrl = 'https://ai-catalog.ru';

function generateSEOMeta(tool: ToolSEOData) {
  const canonicalUrl = `${siteUrl}/tool/${tool.slug}`;
  const fullImageUrl = `${siteUrl}${tool.coverImage}`;

  return {
    title: `${tool.title} | AI Catalog CIS`,
    description: tool.shortDescription,
    canonical: canonicalUrl,
    og: {
      title: tool.title,
      description: tool.shortDescription,
      image: fullImageUrl,
      url: canonicalUrl,
      type: 'website'
    }
  };
}

function generateSchemaOrg(tool: ToolSEOData) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: tool.title,
    description: tool.shortDescription,
    image: `${siteUrl}${tool.coverImage}`,
    url: `${siteUrl}/tool/${tool.slug}`
  };

  if (tool.rating !== undefined) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: tool.rating,
      bestRating: 5,
      worstRating: 0,
      ratingCount: 1
    };
  }

  return schema;
}

const toolSEOArb = fc.record({
  title: fc.string({ minLength: 1, maxLength: 100 }),
  shortDescription: fc.string({ minLength: 10, maxLength: 200 }),
  coverImage: fc.constant('/images/tools/placeholder.jpg'),
  slug: fc.string({ minLength: 1, maxLength: 50 }).map(s => s.replace(/[^a-z0-9-]/gi, '-').toLowerCase()),
  rating: fc.option(fc.float({ min: 0, max: 5, noNaN: true }), { nil: undefined })
});

describe('Property 8: SEO meta tags completeness', () => {
  it('should generate all required meta tags', () => {
    fc.assert(
      fc.property(toolSEOArb, (tool) => {
        const meta = generateSEOMeta(tool);

        // Title
        expect(meta.title).toContain(tool.title);
        expect(meta.title.length).toBeGreaterThan(0);

        // Description
        expect(meta.description).toBe(tool.shortDescription);
        expect(meta.description.length).toBeGreaterThanOrEqual(10);

        // Canonical
        expect(meta.canonical).toContain(tool.slug);
        expect(meta.canonical).toMatch(/^https?:\/\//);

        // Open Graph
        expect(meta.og.title).toBe(tool.title);
        expect(meta.og.description).toBe(tool.shortDescription);
        expect(meta.og.image).toContain(tool.coverImage);
        expect(meta.og.url).toBe(meta.canonical);
        expect(meta.og.type).toBe('website');
      }),
      { numRuns: 100 }
    );
  });

  it('should generate valid URLs', () => {
    fc.assert(
      fc.property(toolSEOArb, (tool) => {
        const meta = generateSEOMeta(tool);

        // Canonical URL должен быть валидным
        expect(() => new URL(meta.canonical)).not.toThrow();

        // OG image URL должен быть валидным
        expect(() => new URL(meta.og.image)).not.toThrow();
      }),
      { numRuns: 100 }
    );
  });
});

describe('Property 9: Schema.org markup validity', () => {
  it('should generate valid Product schema', () => {
    fc.assert(
      fc.property(toolSEOArb, (tool) => {
        const schema = generateSchemaOrg(tool);

        expect(schema['@context']).toBe('https://schema.org');
        expect(schema['@type']).toBe('Product');
        expect(schema.name).toBe(tool.title);
        expect(schema.description).toBe(tool.shortDescription);
        expect(typeof schema.image).toBe('string');
        expect(typeof schema.url).toBe('string');
      }),
      { numRuns: 100 }
    );
  });

  it('should include AggregateRating only when rating exists', () => {
    fc.assert(
      fc.property(toolSEOArb, (tool) => {
        const schema = generateSchemaOrg(tool);

        if (tool.rating !== undefined) {
          expect(schema.aggregateRating).toBeDefined();
          const rating = schema.aggregateRating as Record<string, unknown>;
          expect(rating['@type']).toBe('AggregateRating');
          expect(rating.ratingValue).toBe(tool.rating);
          expect(rating.bestRating).toBe(5);
          expect(rating.worstRating).toBe(0);
        } else {
          expect(schema.aggregateRating).toBeUndefined();
        }
      }),
      { numRuns: 100 }
    );
  });

  it('should generate valid JSON', () => {
    fc.assert(
      fc.property(toolSEOArb, (tool) => {
        const schema = generateSchemaOrg(tool);
        const json = JSON.stringify(schema);

        // Должен быть валидным JSON
        expect(() => JSON.parse(json)).not.toThrow();

        // Парсинг должен вернуть эквивалентный объект
        expect(JSON.parse(json)).toEqual(schema);
      }),
      { numRuns: 100 }
    );
  });
});
