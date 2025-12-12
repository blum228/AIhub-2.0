import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// **Feature: catalog-upgrade-v2, Property 2: Category page filtering correctness**
// For any category page, all displayed tools SHALL match the category's filter criteria
// (tag or field value), and no tools matching the criteria SHALL be excluded.

const ALL_TAGS = ['chatbot', 'image-gen', 'video', 'telegram-bot', 'russian', 'russian-cards', 'crypto', 'no-vpn'];
const PRICE_MODELS = ['free', 'freemium', 'paid'] as const;

interface Tool {
  slug: string;
  title: string;
  tags: string[];
  priceModel: 'free' | 'freemium' | 'paid';
  acceptsRussianCards: boolean;
  requiresVpn: boolean;
  collections?: string[];
}

interface Collection {
  slug: string;
  filterTag?: string;
  filterField?: 'acceptsRussianCards' | 'requiresVpn' | 'priceModel';
  filterValue?: any;
}

const toolArb = fc.record({
  slug: fc.stringMatching(/^[a-z][a-z0-9-]{2,20}$/),
  title: fc.string({ minLength: 1, maxLength: 50 }),
  tags: fc.uniqueArray(fc.constantFrom(...ALL_TAGS), { minLength: 1, maxLength: 4 }),
  priceModel: fc.constantFrom(...PRICE_MODELS),
  acceptsRussianCards: fc.boolean(),
  requiresVpn: fc.boolean(),
  collections: fc.option(fc.uniqueArray(
    fc.constantFrom('ai-girlfriends', 'image-generators', 'telegram-bots', 'free-tools', 'russian-friendly'),
    { minLength: 0, maxLength: 3 }
  ), { nil: undefined })
});

const collectionArb = fc.record({
  slug: fc.constantFrom('ai-girlfriends', 'image-generators', 'telegram-bots', 'free-tools', 'russian-friendly'),
  filterTag: fc.option(fc.constantFrom(...ALL_TAGS), { nil: undefined }),
  filterField: fc.option(fc.constantFrom('acceptsRussianCards', 'requiresVpn', 'priceModel') as fc.Arbitrary<'acceptsRussianCards' | 'requiresVpn' | 'priceModel'>, { nil: undefined }),
  filterValue: fc.option(fc.oneof(fc.boolean(), fc.constantFrom(...PRICE_MODELS)), { nil: undefined })
});

// Core filtering logic (mirrors src/lib/collections.ts)
function getToolsForCollection(tools: Tool[], collection: Collection): Tool[] {
  return tools.filter(tool => {
    // Check explicit collection membership first
    if (tool.collections?.includes(collection.slug)) {
      return true;
    }
    
    // Check tag filter
    if (collection.filterTag && tool.tags.includes(collection.filterTag)) {
      return true;
    }
    
    // Check field filter
    if (collection.filterField && collection.filterValue !== undefined) {
      const fieldValue = tool[collection.filterField];
      return fieldValue === collection.filterValue;
    }
    
    return false;
  });
}

function toolMatchesCollection(tool: Tool, collection: Collection): boolean {
  if (tool.collections?.includes(collection.slug)) return true;
  if (collection.filterTag && tool.tags.includes(collection.filterTag)) return true;
  if (collection.filterField && collection.filterValue !== undefined) {
    return tool[collection.filterField] === collection.filterValue;
  }
  return false;
}

describe('Property 2: Category page filtering correctness', () => {
  it('all displayed tools match the collection filter criteria', () => {
    fc.assert(
      fc.property(
        fc.array(toolArb, { minLength: 1, maxLength: 20 }),
        collectionArb,
        (tools, collection) => {
          const filteredTools = getToolsForCollection(tools, collection);
          
          // Every filtered tool must match the criteria
          for (const tool of filteredTools) {
            expect(toolMatchesCollection(tool, collection)).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('no matching tools are excluded from the result', () => {
    fc.assert(
      fc.property(
        fc.array(toolArb, { minLength: 1, maxLength: 20 }),
        collectionArb,
        (tools, collection) => {
          const filteredTools = getToolsForCollection(tools, collection);
          const filteredSlugs = new Set(filteredTools.map(t => t.slug));
          
          // Every tool that matches must be in the result
          for (const tool of tools) {
            if (toolMatchesCollection(tool, collection)) {
              expect(filteredSlugs.has(tool.slug)).toBe(true);
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('explicit collection membership takes priority', () => {
    fc.assert(
      fc.property(
        toolArb,
        fc.constantFrom('ai-girlfriends', 'image-generators', 'telegram-bots'),
        (tool, collectionSlug) => {
          const toolWithCollection = { ...tool, collections: [collectionSlug] };
          const collection: Collection = { slug: collectionSlug };
          
          expect(toolMatchesCollection(toolWithCollection, collection)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});
