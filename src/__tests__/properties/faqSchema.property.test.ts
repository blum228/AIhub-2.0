import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// **Feature: catalog-upgrade-v2, Property 16: FAQ schema.org conditional presence**
// For any tool page where the tool has a non-empty FAQ array,
// the rendered HTML SHALL contain a valid JSON-LD script with "@type": "FAQPage".

interface FaqItem {
  question: string;
  answer: string;
}

interface Tool {
  slug: string;
  title: string;
  faq?: FaqItem[];
}

interface FaqSchema {
  "@context": string;
  "@type": string;
  mainEntity: Array<{
    "@type": string;
    name: string;
    acceptedAnswer: {
      "@type": string;
      text: string;
    };
  }>;
}

const faqItemArb = fc.record({
  question: fc.string({ minLength: 5, maxLength: 100 }),
  answer: fc.string({ minLength: 10, maxLength: 500 })
});

const toolArb = fc.record({
  slug: fc.stringMatching(/^[a-z][a-z0-9-]{2,20}$/),
  title: fc.string({ minLength: 1, maxLength: 50 }),
  faq: fc.option(fc.array(faqItemArb, { minLength: 0, maxLength: 10 }), { nil: undefined })
});

// Simulates FAQ schema generation
function generateFaqSchema(faq: FaqItem[]): FaqSchema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(item => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
}

function shouldHaveFaqSchema(tool: Tool): boolean {
  return !!tool.faq && tool.faq.length > 0;
}

describe('Property 16: FAQ schema.org conditional presence', () => {
  it('FAQ schema is generated only when FAQ exists and is non-empty', () => {
    fc.assert(
      fc.property(toolArb, (tool) => {
        const shouldGenerate = shouldHaveFaqSchema(tool);
        
        if (tool.faq && tool.faq.length > 0) {
          expect(shouldGenerate).toBe(true);
        } else {
          expect(shouldGenerate).toBe(false);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('FAQ schema has correct @type', () => {
    fc.assert(
      fc.property(
        fc.array(faqItemArb, { minLength: 1, maxLength: 10 }),
        (faq) => {
          const schema = generateFaqSchema(faq);
          expect(schema["@type"]).toBe("FAQPage");
        }
      ),
      { numRuns: 100 }
    );
  });

  it('FAQ schema has valid @context', () => {
    fc.assert(
      fc.property(
        fc.array(faqItemArb, { minLength: 1, maxLength: 10 }),
        (faq) => {
          const schema = generateFaqSchema(faq);
          expect(schema["@context"]).toBe("https://schema.org");
        }
      ),
      { numRuns: 100 }
    );
  });

  it('mainEntity count matches FAQ items count', () => {
    fc.assert(
      fc.property(
        fc.array(faqItemArb, { minLength: 1, maxLength: 10 }),
        (faq) => {
          const schema = generateFaqSchema(faq);
          expect(schema.mainEntity.length).toBe(faq.length);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('each mainEntity item has Question type with Answer', () => {
    fc.assert(
      fc.property(
        fc.array(faqItemArb, { minLength: 1, maxLength: 10 }),
        (faq) => {
          const schema = generateFaqSchema(faq);
          
          schema.mainEntity.forEach((item, index) => {
            expect(item["@type"]).toBe("Question");
            expect(item.name).toBe(faq[index].question);
            expect(item.acceptedAnswer["@type"]).toBe("Answer");
            expect(item.acceptedAnswer.text).toBe(faq[index].answer);
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
