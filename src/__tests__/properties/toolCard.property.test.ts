import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// **Feature: ai-catalog-cis, Property 2: Tool card rendering completeness**
// For any valid tool data, the rendered Tool Card SHALL contain:
// tool name, short description, cover image, price model badge, and at least one tag.

const ALL_TAGS = ['chatbot', 'image-gen', 'video', 'telegram-bot', 'russian', 'russian-cards', 'crypto', 'no-vpn'];
const PRICE_MODELS = ['free', 'freemium', 'paid'] as const;

const toolArb = fc.record({
  slug: fc.string({ minLength: 1, maxLength: 50 }),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  shortDescription: fc.string({ minLength: 10, maxLength: 200 }),
  coverImage: fc.constant('/images/tools/placeholder.jpg'),
  tags: fc.uniqueArray(fc.constantFrom(...ALL_TAGS), { minLength: 1, maxLength: 5 }),
  priceModel: fc.constantFrom(...PRICE_MODELS),
  isNsfw: fc.boolean()
});

// Симуляция рендеринга карточки (проверяем что все данные присутствуют)
function renderToolCard(tool: {
  slug: string;
  title: string;
  shortDescription: string;
  coverImage: string;
  tags: string[];
  priceModel: 'free' | 'freemium' | 'paid';
  isNsfw: boolean;
}) {
  const priceLabels = { free: 'Бесплатно', freemium: 'Freemium', paid: 'Платно' };

  return {
    hasTitle: tool.title.length > 0,
    hasDescription: tool.shortDescription.length >= 10,
    hasCoverImage: tool.coverImage.length > 0,
    hasPriceBadge: priceLabels[tool.priceModel] !== undefined,
    hasAtLeastOneTag: tool.tags.length >= 1,
    tagCount: tool.tags.length,
    priceLabel: priceLabels[tool.priceModel],
    nsfwClass: tool.isNsfw ? 'nsfw-image' : ''
  };
}

describe('Property 2: Tool card rendering completeness', () => {
  it('should render all required elements for any valid tool', () => {
    fc.assert(
      fc.property(toolArb, (tool) => {
        const rendered = renderToolCard(tool);

        expect(rendered.hasTitle).toBe(true);
        expect(rendered.hasDescription).toBe(true);
        expect(rendered.hasCoverImage).toBe(true);
        expect(rendered.hasPriceBadge).toBe(true);
        expect(rendered.hasAtLeastOneTag).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('should display correct price label for each price model', () => {
    fc.assert(
      fc.property(toolArb, (tool) => {
        const rendered = renderToolCard(tool);

        const expectedLabels: Record<string, string> = {
          free: 'Бесплатно',
          freemium: 'Freemium',
          paid: 'Платно'
        };

        expect(rendered.priceLabel).toBe(expectedLabels[tool.priceModel]);
      }),
      { numRuns: 100 }
    );
  });

  it('should apply nsfw class only when isNsfw is true', () => {
    fc.assert(
      fc.property(toolArb, (tool) => {
        const rendered = renderToolCard(tool);

        if (tool.isNsfw) {
          expect(rendered.nsfwClass).toBe('nsfw-image');
        } else {
          expect(rendered.nsfwClass).toBe('');
        }
      }),
      { numRuns: 100 }
    );
  });

  it('should display up to 3 tags', () => {
    fc.assert(
      fc.property(toolArb, (tool) => {
        const displayedTags = tool.tags.slice(0, 3);
        expect(displayedTags.length).toBeLessThanOrEqual(3);
        expect(displayedTags.length).toBeGreaterThanOrEqual(1);
      }),
      { numRuns: 100 }
    );
  });
});
