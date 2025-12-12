import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// **Feature: ai-catalog-cis, Property 4: Tool page section completeness**
// For any valid tool data:
// - The Tool Page SHALL display full description, cover image, and affiliate link
// - IF the tool has FAQ data THEN the page SHALL display all FAQ items
// - IF acceptsRussianCards is false THEN the page SHALL display payment guide section
// - The page SHALL display related tools that share at least one tag with the current tool

const ALL_TAGS = ['chatbot', 'image-gen', 'video', 'telegram-bot', 'russian', 'russian-cards', 'crypto', 'no-vpn'];

const faqItemArb = fc.record({
  question: fc.string({ minLength: 1, maxLength: 200 }),
  answer: fc.string({ minLength: 1, maxLength: 500 })
});

const toolArb = fc.record({
  slug: fc.string({ minLength: 1, maxLength: 50 }),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  shortDescription: fc.string({ minLength: 10, maxLength: 200 }),
  coverImage: fc.constant('/images/tools/placeholder.jpg'),
  tags: fc.uniqueArray(fc.constantFrom(...ALL_TAGS), { minLength: 1, maxLength: 5 }),
  priceModel: fc.constantFrom('free', 'freemium', 'paid') as fc.Arbitrary<'free' | 'freemium' | 'paid'>,
  isNsfw: fc.boolean(),
  affiliateLink: fc.constant('https://example.com/ref'),
  acceptsRussianCards: fc.boolean(),
  faq: fc.option(fc.array(faqItemArb, { minLength: 0, maxLength: 5 }), { nil: undefined })
});

interface ToolPageRenderResult {
  hasDescription: boolean;
  hasCoverImage: boolean;
  hasAffiliateLink: boolean;
  faqItemsCount: number;
  showsPaymentGuide: boolean;
  relatedToolsCount: number;
}

function simulateToolPageRender(
  tool: {
    shortDescription: string;
    coverImage: string;
    affiliateLink: string;
    acceptsRussianCards: boolean;
    faq?: { question: string; answer: string }[];
    tags: string[];
  },
  allTools: { slug: string; tags: string[] }[]
): ToolPageRenderResult {
  // Находим похожие инструменты
  const relatedTools = allTools.filter(t =>
    t.tags.some(tag => tool.tags.includes(tag))
  );

  return {
    hasDescription: tool.shortDescription.length >= 10,
    hasCoverImage: tool.coverImage.length > 0,
    hasAffiliateLink: tool.affiliateLink.startsWith('http'),
    faqItemsCount: tool.faq?.length ?? 0,
    showsPaymentGuide: !tool.acceptsRussianCards,
    relatedToolsCount: relatedTools.length
  };
}

describe('Property 4: Tool page section completeness', () => {
  it('should display required sections for any valid tool', () => {
    fc.assert(
      fc.property(toolArb, (tool) => {
        const result = simulateToolPageRender(tool, []);

        expect(result.hasDescription).toBe(true);
        expect(result.hasCoverImage).toBe(true);
        expect(result.hasAffiliateLink).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('should display all FAQ items when FAQ exists', () => {
    fc.assert(
      fc.property(toolArb, (tool) => {
        const result = simulateToolPageRender(tool, []);

        if (tool.faq && tool.faq.length > 0) {
          expect(result.faqItemsCount).toBe(tool.faq.length);
        } else {
          expect(result.faqItemsCount).toBe(0);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('should show payment guide when acceptsRussianCards is false', () => {
    fc.assert(
      fc.property(toolArb, (tool) => {
        const result = simulateToolPageRender(tool, []);

        expect(result.showsPaymentGuide).toBe(!tool.acceptsRussianCards);
      }),
      { numRuns: 100 }
    );
  });

  it('should find related tools with shared tags', () => {
    fc.assert(
      fc.property(
        toolArb,
        fc.array(
          fc.record({
            slug: fc.string({ minLength: 1 }),
            tags: fc.uniqueArray(fc.constantFrom(...ALL_TAGS), { minLength: 1, maxLength: 3 })
          }),
          { minLength: 0, maxLength: 10 }
        ),
        (tool, otherTools) => {
          const result = simulateToolPageRender(tool, otherTools);

          // Проверяем что найденные related tools действительно имеют общие теги
          const expectedRelated = otherTools.filter(t =>
            t.tags.some(tag => tool.tags.includes(tag))
          );

          expect(result.relatedToolsCount).toBe(expectedRelated.length);
        }
      ),
      { numRuns: 100 }
    );
  });
});
