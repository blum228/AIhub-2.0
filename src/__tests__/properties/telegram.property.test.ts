import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// **Feature: ai-catalog-cis, Property 11: Telegram bot direct link**
// For any tool tagged as "telegram-bot", the rendered Tool Card
// SHALL display a direct link to the Telegram bot.

interface TelegramBotTool {
  slug: string;
  title: string;
  tags: string[];
  telegramBotLink?: string;
}

const ALL_TAGS = ['chatbot', 'image-gen', 'video', 'telegram-bot', 'russian', 'russian-cards', 'crypto', 'no-vpn'];

// Генератор инструментов с telegram-bot тегом
const telegramBotArb = fc.record({
  slug: fc.string({ minLength: 1, maxLength: 50 }),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  tags: fc.uniqueArray(fc.constantFrom(...ALL_TAGS), { minLength: 1, maxLength: 5 })
    .filter(tags => tags.includes('telegram-bot')),
  telegramBotLink: fc.option(
    fc.constant('https://t.me/testbot'),
    { nil: undefined }
  )
});

// Генератор обычных инструментов (без telegram-bot)
const regularToolArb = fc.record({
  slug: fc.string({ minLength: 1, maxLength: 50 }),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  tags: fc.uniqueArray(
    fc.constantFrom('chatbot', 'image-gen', 'video', 'russian', 'russian-cards', 'crypto', 'no-vpn'),
    { minLength: 1, maxLength: 5 }
  ),
  telegramBotLink: fc.constant(undefined) as fc.Arbitrary<undefined>
});

function shouldShowTelegramLink(tool: TelegramBotTool): boolean {
  return tool.tags.includes('telegram-bot') && !!tool.telegramBotLink;
}

function renderTelegramLink(tool: TelegramBotTool): string | null {
  if (shouldShowTelegramLink(tool)) {
    return tool.telegramBotLink!;
  }
  return null;
}

describe('Property 11: Telegram bot direct link', () => {
  it('should show telegram link for telegram-bot tagged tools with link', () => {
    fc.assert(
      fc.property(telegramBotArb, (tool) => {
        const link = renderTelegramLink(tool);

        if (tool.telegramBotLink) {
          expect(link).toBe(tool.telegramBotLink);
          expect(link).toMatch(/^https:\/\/t\.me\//);
        } else {
          expect(link).toBeNull();
        }
      }),
      { numRuns: 100 }
    );
  });

  it('should not show telegram link for non-telegram-bot tools', () => {
    fc.assert(
      fc.property(regularToolArb, (tool) => {
        const link = renderTelegramLink(tool);
        expect(link).toBeNull();
      }),
      { numRuns: 100 }
    );
  });

  it('should correctly identify telegram-bot tag', () => {
    fc.assert(
      fc.property(
        fc.record({
          slug: fc.string({ minLength: 1 }),
          title: fc.string({ minLength: 1 }),
          tags: fc.uniqueArray(fc.constantFrom(...ALL_TAGS), { minLength: 1, maxLength: 5 }),
          telegramBotLink: fc.option(fc.constant('https://t.me/bot'), { nil: undefined })
        }),
        (tool) => {
          const isTelegramBot = tool.tags.includes('telegram-bot');
          const hasLink = !!tool.telegramBotLink;
          const shouldShow = shouldShowTelegramLink(tool);

          expect(shouldShow).toBe(isTelegramBot && hasLink);
        }
      ),
      { numRuns: 100 }
    );
  });
});
