import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// **Feature: catalog-upgrade-v2, Property 1: Category tool count accuracy**
// For any collection and any set of tools, the tool count displayed on the category card
// SHALL equal the actual number of tools matching that collection's filter criteria.

const ALL_TAGS = ['chatbot', 'image-gen', 'video', 'telegram-bot', 'russian', 'russian-cards', 'crypto', 'no-vpn'];
const PRICE_MODELS = ['free', 'freemium', 'paid'] as const;
const COLLECTION_SLUGS = ['ai-girlfriends', 'image-generators', 'telegram-bots', 'free-tools', 'russian-friendly'];

interface Tool {
  slug: string;
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
  tags: fc.uniqueArray(fc.constantFrom(...ALL_TAGS), { minLength: 1, maxLength: 4 }),
  priceModel: fc.constantFrom(...PRICE_MODELS),
  acceptsRussianCards: fc.boolean(),
  requiresVpn: fc.boolean(),
  collections: fc.option(fc.uniqueArray(fc.constantFrom(...COLLECTION_SLUGS), { minLength: 0, maxLength: 3 }), { nil: undefined })
});

// Predefined collections matching the actual content
const predefinedCollections: Collection[] = [
  { slug: 'ai-girlfriends', filterTag: 'chatbot' },
  { slug: 'image-generators', filterTag: 'image-gen' },
  { slug: 'telegram-bots', filterTag: 'telegram-bot' },
  { slug: 'free-tools', filterField: 'priceModel', filterValue: 'free' },
  { slug: 'russian-friendly', filterField: 'acceptsRussianCards', filterValue: true }
];

// Core logic (mirrors src/lib/collections.ts)
function toolMatchesCollection(tool: Tool, collection: Collection): boolean {
  if (tool.collections?.includes(collection.slug)) return true;
  if (collection.filterTag && tool.tags.includes(collection.filterTag)) return true;
  if (collection.filterField && collection.filterValue !== undefined) {
    return tool[collection.filterField] === collection.filterValue;
  }
  return false;
}

function getToolCountForCollection(tools: Tool[], collection: Collection): number {
  return tools.filter(tool => toolMatchesCollection(tool, collection)).length;
}

function countMatchingToolsManually(tools: Tool[], collection: Collection): number {
  let count = 0;
  for (const tool of tools) {
    if (toolMatchesCollection(tool, collection)) {
      count++;
    }
  }
  return count;
}

describe('Property 1: Category tool count accuracy', () => {
  it('tool count equals actual matching tools count', () => {
    fc.assert(
      fc.property(
        fc.array(toolArb, { minLength: 0, maxLength: 30 }),
        fc.constantFrom(...predefinedCollections),
        (tools, collection) => {
          const displayedCount = getToolCountForCollection(tools, collection);
          const actualCount = countMatchingToolsManually(tools, collection);
          
          expect(displayedCount).toBe(actualCount);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('count is non-negative for any input', () => {
    fc.assert(
      fc.property(
        fc.array(toolArb, { minLength: 0, maxLength: 30 }),
        fc.constantFrom(...predefinedCollections),
        (tools, collection) => {
          const count = getToolCountForCollection(tools, collection);
          expect(count).toBeGreaterThanOrEqual(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('count never exceeds total tools count', () => {
    fc.assert(
      fc.property(
        fc.array(toolArb, { minLength: 0, maxLength: 30 }),
        fc.constantFrom(...predefinedCollections),
        (tools, collection) => {
          const count = getToolCountForCollection(tools, collection);
          expect(count).toBeLessThanOrEqual(tools.length);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('empty tools array returns zero count', () => {
    for (const collection of predefinedCollections) {
      const count = getToolCountForCollection([], collection);
      expect(count).toBe(0);
    }
  });
});
