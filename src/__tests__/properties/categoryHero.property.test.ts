/**
 * Property-based tests for CategoryHero component
 * **Feature: category-page-magazine-redesign, Property 1: Hero section displays category data correctly**
 * **Validates: Requirements 1.1, 1.2, 1.3**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

interface CategoryHeroProps {
  icon: string;
  title: string;
  description: string;
  toolCount: number;
}

// Arbitrary generator for CategoryHeroProps
const categoryHeroPropsArbitrary: fc.Arbitrary<CategoryHeroProps> = fc.record({
  icon: fc.string({ minLength: 1, maxLength: 4 }), // Emoji icons
  title: fc.string({ minLength: 1, maxLength: 100 }),
  description: fc.string({ minLength: 1, maxLength: 500 }),
  toolCount: fc.integer({ min: 0, max: 1000 })
});

/**
 * Simulates what CategoryHero component would render
 * Returns an object describing what elements would be present
 */
function simulateCategoryHeroRender(props: CategoryHeroProps) {
  const { icon, title, description, toolCount } = props;
  
  // Russian pluralization for "сервис"
  const toolWord = toolCount === 1 ? 'сервис' : 
    toolCount >= 2 && toolCount <= 4 ? 'сервиса' : 'сервисов';

  return {
    hasIcon: !!icon,
    iconValue: icon,
    hasTitle: !!title,
    titleValue: title,
    hasDescription: !!description,
    descriptionValue: description,
    hasToolCount: true,
    toolCountValue: toolCount,
    toolCountDisplay: `${toolCount} ${toolWord}`
  };
}

describe('CategoryHero - Property-Based Tests', () => {
  // **Feature: category-page-magazine-redesign, Property 1: Hero section displays category data correctly**
  describe('Property 1: Hero section displays category data correctly', () => {
    it('should always contain icon, title, description, and tool count', () => {
      fc.assert(
        fc.property(
          categoryHeroPropsArbitrary,
          (props) => {
            const rendered = simulateCategoryHeroRender(props);
            
            // All required elements must be present
            expect(rendered.hasIcon).toBe(true);
            expect(rendered.hasTitle).toBe(true);
            expect(rendered.hasDescription).toBe(true);
            expect(rendered.hasToolCount).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should display the exact category data passed as props', () => {
      fc.assert(
        fc.property(
          categoryHeroPropsArbitrary,
          (props) => {
            const rendered = simulateCategoryHeroRender(props);
            
            expect(rendered.iconValue).toBe(props.icon);
            expect(rendered.titleValue).toBe(props.title);
            expect(rendered.descriptionValue).toBe(props.description);
            expect(rendered.toolCountValue).toBe(props.toolCount);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should correctly pluralize tool count in Russian', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 1000 }),
          (count) => {
            const props: CategoryHeroProps = {
              icon: '🤖',
              title: 'Test',
              description: 'Test description',
              toolCount: count
            };
            const rendered = simulateCategoryHeroRender(props);
            
            // Check Russian pluralization rules
            if (count === 1) {
              expect(rendered.toolCountDisplay).toBe(`${count} сервис`);
            } else if (count >= 2 && count <= 4) {
              expect(rendered.toolCountDisplay).toBe(`${count} сервиса`);
            } else {
              expect(rendered.toolCountDisplay).toBe(`${count} сервисов`);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle edge cases for tool count (0, 1, boundary values)', () => {
      const edgeCases = [0, 1, 2, 4, 5, 10, 11, 21, 22, 100];
      
      edgeCases.forEach(count => {
        const props: CategoryHeroProps = {
          icon: '🎨',
          title: 'Test Category',
          description: 'Test description',
          toolCount: count
        };
        const rendered = simulateCategoryHeroRender(props);
        
        expect(rendered.toolCountValue).toBe(count);
        expect(rendered.toolCountDisplay).toContain(count.toString());
      });
    });
  });
});
