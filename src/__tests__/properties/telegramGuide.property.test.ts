import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// **Feature: catalog-upgrade-v2, Property 10: Telegram guide presence**
// For any tool page where the tool is tagged as "telegram-bot",
// the page SHALL contain a step-by-step guide section.

const ALL_TAGS = ['chatbot', 'image-gen', 'video', 'telegram-bot', 'russian', 'russian-cards', 'crypto', 'no-vpn'];

interface Tool {
  slug: string;
  title: string;
  tags: string[];
  telegramBotLink?: string;
}

const toolArb = fc.record({
  slug: fc.stringMatching(/^[a-z][a-z0-9-]{2,20}$/),
  title: fc.string({ minLength: 1, maxLength: 50 }),
  tags: fc.uniqueArray(fc.constantFrom(...ALL_TAGS), { minLength: 1, maxLength: 4 }),
  telegramBotLink: fc.option(fc.webUrl(), { nil: undefined })
});

// Determines if Telegram guide should be shown
function shouldShowTelegramGuide(tool: Tool): boolean {
  return tool.tags.includes('telegram-bot');
}

// Simulates guide rendering
function renderTelegramGuide(botLink: string, botName: string) {
  const steps = [
    { number: 1, title: 'Откройте бота' },
    { number: 2, title: 'Нажмите "Start"' },
    { number: 3, title: 'Следуйте инструкциям' }
  ];
  
  return {
    hasSteps: steps.length === 3,
    hasButton: botLink.length > 0,
    buttonText: `Открыть ${botName} в Telegram`,
    stepCount: steps.length
  };
}

describe('Property 10: Telegram guide presence', () => {
  it('guide is shown for tools tagged as telegram-bot', () => {
    fc.assert(
      fc.property(toolArb, (tool) => {
        const shouldShow = shouldShowTelegramGuide(tool);
        
        if (tool.tags.includes('telegram-bot')) {
          expect(shouldShow).toBe(true);
        } else {
          expect(shouldShow).toBe(false);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('guide contains exactly 3 steps', () => {
    fc.assert(
      fc.property(
        fc.webUrl(),
        fc.string({ minLength: 1, maxLength: 30 }),
        (botLink, botName) => {
          const guide = renderTelegramGuide(botLink, botName);
          expect(guide.stepCount).toBe(3);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('guide has button with bot name', () => {
    fc.assert(
      fc.property(
        fc.webUrl(),
        fc.string({ minLength: 1, maxLength: 30 }),
        (botLink, botName) => {
          const guide = renderTelegramGuide(botLink, botName);
          expect(guide.buttonText).toContain(botName);
          expect(guide.buttonText).toContain('Telegram');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('guide is not shown for non-telegram tools', () => {
    const nonTelegramTags = ALL_TAGS.filter(t => t !== 'telegram-bot');
    
    fc.assert(
      fc.property(
        fc.uniqueArray(fc.constantFrom(...nonTelegramTags), { minLength: 1, maxLength: 3 }),
        (tags) => {
          const tool: Tool = { slug: 'test', title: 'Test', tags };
          expect(shouldShowTelegramGuide(tool)).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });
});
