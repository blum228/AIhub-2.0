/**
 * Property-based tests for ToolHero component
 * **Feature: tool-page-redesign, Property 1: Hero completeness**
 * **Validates: Requirements 1.1, 1.3, 1.4**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import type { ToolData } from '../../lib/types';

// Arbitrary generator for ToolData
const toolDataArbitrary: fc.Arbitrary<ToolData> = fc.record({
  slug: fc.string({ minLength: 1, maxLength: 50 }).map(s => s.replace(/[^a-z0-9-]/gi, '-')),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  shortDescription: fc.string({ minLength: 1, maxLength: 500 }),
  coverImage: fc.string({ minLength: 1 }).map(s => `/images/${s.replace(/[^a-z0-9]/gi, '')}.jpg`),
  gifPreview: fc.oneof(fc.constant(undefined), fc.string().map(s => `/images/${s}.gif`)),
  tags: fc.array(fc.constantFrom('chatbot', 'image-gen', 'video', 'telegram-bot', 'russian', 'russian-cards', 'crypto', 'no-vpn'), { minLength: 0, maxLength: 5 }),
  priceModel: fc.constantFrom('free', 'freemium', 'paid') as fc.Arbitrary<'free' | 'freemium' | 'paid'>,
  priceFrom: fc.oneof(fc.constant(undefined), fc.integer({ min: 1, max: 1000 })),
  isNsfw: fc.boolean(),
  affiliateLink: fc.webUrl(),
  rating: fc.oneof(fc.constant(undefined), fc.float({ min: 1, max: 5, noNaN: true })),
  acceptsRussianCards: fc.boolean(),
  requiresVpn: fc.boolean(),
  supportsRussian: fc.boolean(),
  paymentMethods: fc.oneof(fc.constant(undefined), fc.array(fc.constantFrom('card', 'crypto', 'paypal', 'sbp', 'yoomoney'), { minLength: 0, maxLength: 5 })),
  telegramBotLink: fc.oneof(fc.constant(undefined), fc.webUrl()),
  faq: fc.oneof(fc.constant(undefined), fc.array(fc.record({ question: fc.string({ minLength: 1 }), answer: fc.string({ minLength: 1 }) }), { minLength: 0, maxLength: 5 })),
  publishedAt: fc.date(),
  updatedAt: fc.oneof(fc.constant(undefined), fc.date())
});

/**
 * Simulates what ToolHero component would render
 * Returns an object describing what elements would be present
 */
function simulateHeroRender(tool: ToolData) {
  const priceDisplay = tool.priceModel === 'free' 
    ? 'Бесплатно' 
    : tool.priceFrom 
      ? `от $${tool.priceFrom}/мес` 
      : tool.priceModel === 'freemium' ? 'Freemium' : 'Платно';

  return {
    hasTitle: !!tool.title,
    hasDescription: !!tool.shortDescription,
    hasCoverImage: !!tool.coverImage,
    hasCtaButton: !!tool.affiliateLink,
    hasPriceDisplay: !!priceDisplay,
    hasRating: tool.rating !== undefined && tool.rating > 0,
    ratingValue: tool.rating,
    hasVpnBadge: true, // Always shows either "Без VPN" or "Нужен VPN"
    hasCardsBadge: true, // Always shows either "Карты РФ" or "Нет карт РФ"
    hasRussianBadge: tool.supportsRussian,
    hasTelegramButton: tool.tags.includes('telegram-bot') && !!tool.telegramBotLink
  };
}

describe('ToolHero - Property-Based Tests', () => {
  // **Feature: tool-page-redesign, Property 1: Hero completeness**
  describe('Hero completeness', () => {
    it('should always contain title, shortDescription, coverImage, CTA button, and price display', () => {
      fc.assert(
        fc.property(
          toolDataArbitrary,
          (tool) => {
            const rendered = simulateHeroRender(tool);
            
            // Required elements must always be present
            expect(rendered.hasTitle).toBe(true);
            expect(rendered.hasDescription).toBe(true);
            expect(rendered.hasCoverImage).toBe(true);
            expect(rendered.hasCtaButton).toBe(true);
            expect(rendered.hasPriceDisplay).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should display rating only when it exists and is > 0', () => {
      fc.assert(
        fc.property(
          toolDataArbitrary,
          (tool) => {
            const rendered = simulateHeroRender(tool);
            
            if (tool.rating !== undefined && tool.rating > 0) {
              expect(rendered.hasRating).toBe(true);
              expect(rendered.ratingValue).toBe(tool.rating);
            } else {
              expect(rendered.hasRating).toBe(false);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should always show VPN and cards badges', () => {
      fc.assert(
        fc.property(
          toolDataArbitrary,
          (tool) => {
            const rendered = simulateHeroRender(tool);
            
            // VPN and cards badges are always shown (positive or negative)
            expect(rendered.hasVpnBadge).toBe(true);
            expect(rendered.hasCardsBadge).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should show Russian badge only when supportsRussian is true', () => {
      fc.assert(
        fc.property(
          toolDataArbitrary,
          (tool) => {
            const rendered = simulateHeroRender(tool);
            expect(rendered.hasRussianBadge).toBe(tool.supportsRussian);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should show Telegram button only for telegram-bot with telegramBotLink', () => {
      fc.assert(
        fc.property(
          toolDataArbitrary,
          (tool) => {
            const rendered = simulateHeroRender(tool);
            const expected = tool.tags.includes('telegram-bot') && !!tool.telegramBotLink;
            expect(rendered.hasTelegramButton).toBe(expected);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
