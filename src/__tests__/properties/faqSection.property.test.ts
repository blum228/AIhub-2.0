/**
 * Property-based tests for FaqSection component
 * **Feature: tool-page-redesign, Property 3: FAQ conditional rendering**
 * **Validates: Requirements 5.1, 5.4**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { generateFAQSchema } from '../../lib/schema';

interface FaqItem {
  question: string;
  answer: string;
}

const faqItemArbitrary: fc.Arbitrary<FaqItem> = fc.record({
  question: fc.string({ minLength: 1, maxLength: 200 }),
  answer: fc.string({ minLength: 1, maxLength: 1000 })
});

/**
 * Simulates FaqSection component rendering logic
 */
function simulateFaqSectionRender(faq: FaqItem[] | undefined): {
  shouldRender: boolean;
  hasSchema: boolean;
  itemCount: number;
} {
  const shouldRender = faq !== undefined && faq.length > 0;
  const schema = generateFAQSchema(faq);
  
  return {
    shouldRender,
    hasSchema: schema !== null,
    itemCount: faq?.length ?? 0
  };
}

describe('FaqSection - Property-Based Tests', () => {
  // **Feature: tool-page-redesign, Property 3: FAQ conditional rendering**
  describe('FAQ conditional rendering', () => {
    it('should NOT render when FAQ is undefined', () => {
      fc.assert(
        fc.property(
          fc.constant(undefined),
          (faq) => {
            const rendered = simulateFaqSectionRender(faq);
            expect(rendered.shouldRender).toBe(false);
            expect(rendered.hasSchema).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should NOT render when FAQ is empty array', () => {
      fc.assert(
        fc.property(
          fc.constant([]),
          (faq) => {
            const rendered = simulateFaqSectionRender(faq);
            expect(rendered.shouldRender).toBe(false);
            expect(rendered.hasSchema).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should render and generate schema when FAQ has items', () => {
      fc.assert(
        fc.property(
          fc.array(faqItemArbitrary, { minLength: 1, maxLength: 10 }),
          (faq) => {
            const rendered = simulateFaqSectionRender(faq);
            expect(rendered.shouldRender).toBe(true);
            expect(rendered.hasSchema).toBe(true);
            expect(rendered.itemCount).toBe(faq.length);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should have consistent render/schema behavior', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constant(undefined),
            fc.array(faqItemArbitrary, { minLength: 0, maxLength: 10 })
          ),
          (faq) => {
            const rendered = simulateFaqSectionRender(faq as FaqItem[] | undefined);
            
            // Schema should exist if and only if section renders
            expect(rendered.hasSchema).toBe(rendered.shouldRender);
            
            // Both should be true only when FAQ has items
            const hasItems = faq !== undefined && faq.length > 0;
            expect(rendered.shouldRender).toBe(hasItems);
            expect(rendered.hasSchema).toBe(hasItems);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Schema generation', () => {
    it('should generate valid FAQPage schema with correct item count', () => {
      fc.assert(
        fc.property(
          fc.array(faqItemArbitrary, { minLength: 1, maxLength: 10 }),
          (faq) => {
            const schema = generateFAQSchema(faq);
            
            expect(schema).not.toBeNull();
            expect(schema!['@type']).toBe('FAQPage');
            expect(schema!.mainEntity).toHaveLength(faq.length);
            
            // Each item should have correct structure
            schema!.mainEntity.forEach((item, index) => {
              expect(item['@type']).toBe('Question');
              expect(item.name).toBe(faq[index].question);
              expect(item.acceptedAnswer['@type']).toBe('Answer');
              expect(item.acceptedAnswer.text).toBe(faq[index].answer);
            });
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
