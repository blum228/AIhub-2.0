import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { z } from 'astro/zod';

// **Feature: ai-catalog-cis, Property 7: Tool schema validation**
// For any tool data object, IF all required fields are present and valid
// THEN schema validation SHALL pass. IF any required field is missing or invalid
// THEN schema validation SHALL fail with a descriptive error.

// Копия схемы для тестирования (без зависимости от Astro Content Collections)
const toolSchema = z.object({
  title: z.string().min(1).max(100),
  shortDescription: z.string().min(10).max(200),
  coverImage: z.string(),
  gifPreview: z.string().optional(),
  tags: z.array(z.string()).min(1),
  priceModel: z.enum(['free', 'freemium', 'paid']),
  isNsfw: z.boolean().default(true),
  affiliateLink: z.string().url(),
  rating: z.number().min(0).max(5).optional(),
  acceptsRussianCards: z.boolean().default(false),
  requiresVpn: z.boolean().default(true),
  supportsRussian: z.boolean().default(false),
  paymentMethods: z.array(z.string()).optional(),
  telegramBotLink: z.string().optional(),
  faq: z.array(z.object({
    question: z.string(),
    answer: z.string()
  })).optional(),
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional()
});

const ALL_TAGS = ['chatbot', 'image-gen', 'video', 'telegram-bot', 'russian', 'russian-cards', 'crypto', 'no-vpn'];

// Генератор валидных данных
const validToolArb = fc.record({
  title: fc.string({ minLength: 1, maxLength: 100 }),
  shortDescription: fc.string({ minLength: 10, maxLength: 200 }),
  coverImage: fc.constant('/images/tools/placeholder.jpg'),
  gifPreview: fc.option(fc.constant('/images/tools/preview.gif'), { nil: undefined }),
  tags: fc.uniqueArray(fc.constantFrom(...ALL_TAGS), { minLength: 1, maxLength: 5 }),
  priceModel: fc.constantFrom('free', 'freemium', 'paid') as fc.Arbitrary<'free' | 'freemium' | 'paid'>,
  isNsfw: fc.boolean(),
  affiliateLink: fc.constant('https://example.com/ref'),
  rating: fc.option(fc.float({ min: 0, max: 5, noNaN: true }), { nil: undefined }),
  acceptsRussianCards: fc.boolean(),
  requiresVpn: fc.boolean(),
  supportsRussian: fc.boolean(),
  paymentMethods: fc.option(fc.array(fc.constantFrom('card', 'crypto', 'paypal')), { nil: undefined }),
  telegramBotLink: fc.option(fc.constant('https://t.me/testbot'), { nil: undefined }),
  faq: fc.option(
    fc.array(fc.record({ question: fc.string({ minLength: 1 }), answer: fc.string({ minLength: 1 }) }), { minLength: 0, maxLength: 5 }),
    { nil: undefined }
  ),
  publishedAt: fc.date({ min: new Date('2020-01-01'), max: new Date('2030-01-01') }),
  updatedAt: fc.option(fc.date({ min: new Date('2020-01-01'), max: new Date('2030-01-01') }), { nil: undefined })
});

describe('Property 7: Tool schema validation', () => {
  it('should pass validation for valid tool data', () => {
    fc.assert(
      fc.property(validToolArb, (toolData) => {
        const result = toolSchema.safeParse(toolData);
        expect(result.success).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('should fail when title is empty', () => {
    fc.assert(
      fc.property(validToolArb, (toolData) => {
        const invalid = { ...toolData, title: '' };
        const result = toolSchema.safeParse(invalid);
        expect(result.success).toBe(false);
      }),
      { numRuns: 50 }
    );
  });

  it('should fail when shortDescription is too short', () => {
    fc.assert(
      fc.property(validToolArb, (toolData) => {
        const invalid = { ...toolData, shortDescription: 'short' };
        const result = toolSchema.safeParse(invalid);
        expect(result.success).toBe(false);
      }),
      { numRuns: 50 }
    );
  });

  it('should fail when tags array is empty', () => {
    fc.assert(
      fc.property(validToolArb, (toolData) => {
        const invalid = { ...toolData, tags: [] };
        const result = toolSchema.safeParse(invalid);
        expect(result.success).toBe(false);
      }),
      { numRuns: 50 }
    );
  });

  it('should fail when affiliateLink is not a valid URL', () => {
    fc.assert(
      fc.property(validToolArb, (toolData) => {
        const invalid = { ...toolData, affiliateLink: 'not-a-url' };
        const result = toolSchema.safeParse(invalid);
        expect(result.success).toBe(false);
      }),
      { numRuns: 50 }
    );
  });

  it('should fail when rating is out of range', () => {
    fc.assert(
      fc.property(
        validToolArb,
        fc.oneof(
          fc.float({ min: Math.fround(-100), max: Math.fround(-0.01), noNaN: true }),
          fc.float({ min: Math.fround(5.01), max: Math.fround(100), noNaN: true })
        ),
        (toolData, invalidRating) => {
          const invalid = { ...toolData, rating: invalidRating };
          const result = toolSchema.safeParse(invalid);
          expect(result.success).toBe(false);
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should fail when priceModel is invalid', () => {
    fc.assert(
      fc.property(validToolArb, (toolData) => {
        const invalid = { ...toolData, priceModel: 'invalid' };
        const result = toolSchema.safeParse(invalid);
        expect(result.success).toBe(false);
      }),
      { numRuns: 50 }
    );
  });
});
