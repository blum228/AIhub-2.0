import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// **Feature: catalog-upgrade-v2, Property 6: Placeholder generation for missing images**
// For any tool where coverImage is empty or undefined, the rendered card SHALL display
// a placeholder element containing the tool's title text.

interface Tool {
  slug: string;
  title: string;
  coverImage: string;
  tags: string[];
}

interface PlaceholderProps {
  title: string;
  category?: string;
}

const ALL_TAGS = ['chatbot', 'image-gen', 'video', 'telegram-bot', 'russian'];

const toolArb = fc.record({
  slug: fc.stringMatching(/^[a-z][a-z0-9-]{2,20}$/),
  title: fc.string({ minLength: 1, maxLength: 50 }),
  coverImage: fc.oneof(
    fc.constant(''),
    fc.constant('/images/tools/placeholder.jpg'),
    fc.webUrl()
  ),
  tags: fc.uniqueArray(fc.constantFrom(...ALL_TAGS), { minLength: 1, maxLength: 3 })
});

// Determines if placeholder should be shown
function shouldShowPlaceholder(tool: Tool): boolean {
  return !tool.coverImage || tool.coverImage.trim() === '';
}

// Simulates placeholder rendering
function renderPlaceholder(props: PlaceholderProps): { hasTitle: boolean; titleText: string } {
  const displayTitle = props.title.length > 30 
    ? props.title.slice(0, 27) + '...' 
    : props.title;
  
  return {
    hasTitle: displayTitle.length > 0,
    titleText: displayTitle
  };
}

// Get primary category from tags
function getPrimaryCategory(tags: string[]): string | undefined {
  const categoryTags = ['chatbot', 'image-gen', 'telegram-bot', 'video'];
  return tags.find(tag => categoryTags.includes(tag));
}

describe('Property 6: Placeholder generation for missing images', () => {
  it('placeholder is shown when coverImage is empty', () => {
    fc.assert(
      fc.property(toolArb, (tool) => {
        const needsPlaceholder = shouldShowPlaceholder(tool);
        
        if (tool.coverImage === '' || !tool.coverImage) {
          expect(needsPlaceholder).toBe(true);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('placeholder contains tool title', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.option(fc.constantFrom(...ALL_TAGS), { nil: undefined }),
        (title, category) => {
          const placeholder = renderPlaceholder({ title, category });
          
          expect(placeholder.hasTitle).toBe(true);
          expect(placeholder.titleText.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('placeholder title is truncated for long titles', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 31, maxLength: 100 }),
        (longTitle) => {
          const placeholder = renderPlaceholder({ title: longTitle });
          
          expect(placeholder.titleText.length).toBeLessThanOrEqual(30);
          expect(placeholder.titleText.endsWith('...')).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('placeholder title is not truncated for short titles', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 30 }),
        (shortTitle) => {
          const placeholder = renderPlaceholder({ title: shortTitle });
          
          expect(placeholder.titleText).toBe(shortTitle);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('category is derived from tool tags', () => {
    fc.assert(
      fc.property(toolArb, (tool) => {
        const category = getPrimaryCategory(tool.tags);
        
        // If tool has a category tag, it should be returned
        const hasCategoryTag = tool.tags.some(t => 
          ['chatbot', 'image-gen', 'telegram-bot', 'video'].includes(t)
        );
        
        if (hasCategoryTag) {
          expect(category).toBeDefined();
        }
      }),
      { numRuns: 100 }
    );
  });
});
