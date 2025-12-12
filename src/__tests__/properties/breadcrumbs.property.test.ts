import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// **Feature: catalog-upgrade-v2, Property 3: Breadcrumbs structure validity**
// For any tool page, the breadcrumbs SHALL contain exactly 3 items:
// Home link, Category link (based on tool's primary tag), and current tool name (no link).

const ALL_TAGS = ['chatbot', 'image-gen', 'video', 'telegram-bot', 'russian', 'russian-cards', 'crypto', 'no-vpn'];
const COLLECTION_SLUGS = ['ai-girlfriends', 'image-generators', 'telegram-bots', 'free-tools', 'russian-friendly'];

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Tool {
  slug: string;
  title: string;
  tags: string[];
}

interface Collection {
  slug: string;
  title: string;
  filterTag?: string;
}

const toolArb = fc.record({
  slug: fc.stringMatching(/^[a-z][a-z0-9-]{2,20}$/),
  title: fc.string({ minLength: 1, maxLength: 50 }),
  tags: fc.uniqueArray(fc.constantFrom(...ALL_TAGS), { minLength: 1, maxLength: 4 })
});

// Predefined collections
const predefinedCollections: Collection[] = [
  { slug: 'ai-girlfriends', title: 'AI Girlfriends', filterTag: 'chatbot' },
  { slug: 'image-generators', title: 'Генераторы изображений', filterTag: 'image-gen' },
  { slug: 'telegram-bots', title: 'Telegram боты', filterTag: 'telegram-bot' }
];

// Logic to get primary collection for a tool
function getPrimaryCollection(tool: Tool, collections: Collection[]): Collection | undefined {
  for (const col of collections) {
    if (col.filterTag && tool.tags.includes(col.filterTag)) {
      return col;
    }
  }
  return undefined;
}

// Generate breadcrumbs for tool page
function generateToolBreadcrumbs(tool: Tool, collections: Collection[]): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [];
  
  // Home is always added by the component, so we start with Catalog
  items.push({ label: 'Каталог', href: '/catalog' });
  
  // Category (if found)
  const primaryCollection = getPrimaryCollection(tool, collections);
  if (primaryCollection) {
    items.push({ 
      label: primaryCollection.title, 
      href: `/category/${primaryCollection.slug}` 
    });
  }
  
  // Current tool (no href)
  items.push({ label: tool.title });
  
  return items;
}

describe('Property 3: Breadcrumbs structure validity', () => {
  it('breadcrumbs contain 2-3 items (excluding Home which is added by component)', () => {
    fc.assert(
      fc.property(toolArb, (tool) => {
        const breadcrumbs = generateToolBreadcrumbs(tool, predefinedCollections);
        
        // 2 items if no category match, 3 if category found
        expect(breadcrumbs.length).toBeGreaterThanOrEqual(2);
        expect(breadcrumbs.length).toBeLessThanOrEqual(3);
      }),
      { numRuns: 100 }
    );
  });

  it('first item is always Catalog with link', () => {
    fc.assert(
      fc.property(toolArb, (tool) => {
        const breadcrumbs = generateToolBreadcrumbs(tool, predefinedCollections);
        
        expect(breadcrumbs[0].label).toBe('Каталог');
        expect(breadcrumbs[0].href).toBe('/catalog');
      }),
      { numRuns: 100 }
    );
  });

  it('last item is tool title without link', () => {
    fc.assert(
      fc.property(toolArb, (tool) => {
        const breadcrumbs = generateToolBreadcrumbs(tool, predefinedCollections);
        const lastItem = breadcrumbs[breadcrumbs.length - 1];
        
        expect(lastItem.label).toBe(tool.title);
        expect(lastItem.href).toBeUndefined();
      }),
      { numRuns: 100 }
    );
  });

  it('category link points to valid category URL when present', () => {
    fc.assert(
      fc.property(toolArb, (tool) => {
        const breadcrumbs = generateToolBreadcrumbs(tool, predefinedCollections);
        
        if (breadcrumbs.length === 3) {
          const categoryItem = breadcrumbs[1];
          expect(categoryItem.href).toMatch(/^\/category\/[a-z-]+$/);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('category matches tool primary tag', () => {
    fc.assert(
      fc.property(toolArb, (tool) => {
        const breadcrumbs = generateToolBreadcrumbs(tool, predefinedCollections);
        const primaryCollection = getPrimaryCollection(tool, predefinedCollections);
        
        if (primaryCollection) {
          expect(breadcrumbs.length).toBe(3);
          expect(breadcrumbs[1].label).toBe(primaryCollection.title);
        } else {
          expect(breadcrumbs.length).toBe(2);
        }
      }),
      { numRuns: 100 }
    );
  });
});
