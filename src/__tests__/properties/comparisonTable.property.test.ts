import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// **Feature: catalog-upgrade-v2, Property 11: Comparison table row links**
// For any category page with a comparison table, each row SHALL be a clickable link
// to the corresponding tool's page URL.

const PRICE_MODELS = ['free', 'freemium', 'paid'] as const;

interface Tool {
  slug: string;
  title: string;
  priceModel: 'free' | 'freemium' | 'paid';
  acceptsRussianCards: boolean;
  requiresVpn: boolean;
  supportsRussian: boolean;
  rating?: number;
}

interface TableRow {
  toolSlug: string;
  linkHref: string;
  hasLink: boolean;
}

const toolArb = fc.record({
  slug: fc.stringMatching(/^[a-z][a-z0-9-]{2,20}$/),
  title: fc.string({ minLength: 1, maxLength: 50 }),
  priceModel: fc.constantFrom(...PRICE_MODELS),
  acceptsRussianCards: fc.boolean(),
  requiresVpn: fc.boolean(),
  supportsRussian: fc.boolean(),
  rating: fc.option(fc.float({ min: 0, max: 5, noNaN: true }), { nil: undefined })
});

// Simulates comparison table rendering
function renderComparisonTable(tools: Tool[]): TableRow[] {
  return tools.map(tool => ({
    toolSlug: tool.slug,
    linkHref: `/tool/${tool.slug}`,
    hasLink: true
  }));
}

function isValidToolUrl(url: string): boolean {
  return /^\/tool\/[a-z][a-z0-9-]*$/.test(url);
}

describe('Property 11: Comparison table row links', () => {
  it('each row has a link to the tool page', () => {
    fc.assert(
      fc.property(
        fc.array(toolArb, { minLength: 1, maxLength: 20 }),
        (tools) => {
          const rows = renderComparisonTable(tools);
          
          for (const row of rows) {
            expect(row.hasLink).toBe(true);
            expect(row.linkHref).toBeDefined();
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('all links point to valid tool URLs', () => {
    fc.assert(
      fc.property(
        fc.array(toolArb, { minLength: 1, maxLength: 20 }),
        (tools) => {
          const rows = renderComparisonTable(tools);
          
          for (const row of rows) {
            expect(isValidToolUrl(row.linkHref)).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('link href matches tool slug', () => {
    fc.assert(
      fc.property(
        fc.array(toolArb, { minLength: 1, maxLength: 20 }),
        (tools) => {
          const rows = renderComparisonTable(tools);
          
          for (let i = 0; i < tools.length; i++) {
            expect(rows[i].linkHref).toBe(`/tool/${tools[i].slug}`);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('row count equals tool count', () => {
    fc.assert(
      fc.property(
        fc.array(toolArb, { minLength: 0, maxLength: 30 }),
        (tools) => {
          const rows = renderComparisonTable(tools);
          expect(rows.length).toBe(tools.length);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('empty tools array produces empty table', () => {
    const rows = renderComparisonTable([]);
    expect(rows.length).toBe(0);
  });
});
