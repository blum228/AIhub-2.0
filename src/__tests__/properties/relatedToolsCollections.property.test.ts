/**
 * Property-based tests for Related Tools with Collections prioritization
 * **Feature: tool-page-redesign, Property 5: Related tools relevance**
 * **Validates: Requirements 6.3**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { findRelatedToolsWithCollections } from '../../lib/tools';
import { getCollectionsForTool } from '../../lib/collections';
import type { ToolData } from '../../lib/types';
import type { CollectionData } from '../../lib/collections';

// Arbitrary generators
const toolDataArbitrary: fc.Arbitrary<ToolData> = fc.record({
  slug: fc.string({ minLength: 1, maxLength: 20 }).map(s => s.replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'tool'),
  title: fc.string({ minLength: 1, maxLength: 50 }),
  shortDescription: fc.string({ minLength: 1, maxLength: 200 }),
  coverImage: fc.constant('/images/placeholder.jpg'),
  tags: fc.array(fc.constantFrom('chatbot', 'image-gen', 'video', 'telegram-bot', 'russian', 'crypto'), { minLength: 1, maxLength: 4 }),
  priceModel: fc.constantFrom('free', 'freemium', 'paid') as fc.Arbitrary<'free' | 'freemium' | 'paid'>,
  priceFrom: fc.oneof(fc.constant(undefined), fc.integer({ min: 1, max: 100 })),
  isNsfw: fc.boolean(),
  affiliateLink: fc.constant('https://example.com'),
  rating: fc.oneof(fc.constant(undefined), fc.float({ min: 1, max: 5, noNaN: true })),
  acceptsRussianCards: fc.boolean(),
  requiresVpn: fc.boolean(),
  supportsRussian: fc.boolean(),
  paymentMethods: fc.oneof(fc.constant(undefined), fc.array(fc.constantFrom('card', 'crypto'), { minLength: 0, maxLength: 2 })),
  publishedAt: fc.date()
});

const collectionDataArbitrary: fc.Arbitrary<CollectionData> = fc.record({
  slug: fc.constantFrom('chatbots', 'image-generators', 'free-tools', 'telegram-bots'),
  title: fc.string({ minLength: 1, maxLength: 30 }),
  description: fc.string({ minLength: 1, maxLength: 100 }),
  seoDescription: fc.string({ minLength: 1, maxLength: 100 }),
  icon: fc.constant('🤖'),
  filterTag: fc.oneof(fc.constant(undefined), fc.constantFrom('chatbot', 'image-gen', 'telegram-bot')),
  order: fc.integer({ min: 1, max: 10 })
});

describe('Related Tools with Collections - Property-Based Tests', () => {
  // **Feature: tool-page-redesign, Property 5: Related tools relevance**
  describe('Related tools relevance', () => {
    it('should not include the current tool in results', () => {
      fc.assert(
        fc.property(
          toolDataArbitrary,
          fc.array(toolDataArbitrary, { minLength: 1, maxLength: 10 }),
          fc.array(collectionDataArbitrary, { minLength: 0, maxLength: 3 }),
          (currentTool, otherTools, collections) => {
            const allTools = [currentTool, ...otherTools];
            const related = findRelatedToolsWithCollections(currentTool, allTools, collections, 4);
            
            expect(related.every(t => t.slug !== currentTool.slug)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return at most limit tools', () => {
      fc.assert(
        fc.property(
          toolDataArbitrary,
          fc.array(toolDataArbitrary, { minLength: 5, maxLength: 15 }),
          fc.array(collectionDataArbitrary, { minLength: 1, maxLength: 3 }),
          fc.integer({ min: 1, max: 6 }),
          (currentTool, otherTools, collections, limit) => {
            const allTools = [currentTool, ...otherTools];
            const related = findRelatedToolsWithCollections(currentTool, allTools, collections, limit);
            
            expect(related.length).toBeLessThanOrEqual(limit);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should prioritize tools from same collections over tag-only matches', () => {
      // Create a controlled test scenario
      const currentTool: ToolData = {
        slug: 'current-tool',
        title: 'Current Tool',
        shortDescription: 'Test',
        coverImage: '/img.jpg',
        tags: ['chatbot', 'russian'],
        priceModel: 'free',
        isNsfw: false,
        affiliateLink: 'https://example.com',
        acceptsRussianCards: true,
        requiresVpn: false,
        supportsRussian: true,
        publishedAt: new Date()
      };

      const sameCollectionTool: ToolData = {
        ...currentTool,
        slug: 'same-collection',
        title: 'Same Collection Tool',
        tags: ['chatbot'] // Same tag = same collection
      };

      const tagOnlyTool: ToolData = {
        ...currentTool,
        slug: 'tag-only',
        title: 'Tag Only Tool',
        tags: ['russian', 'video'] // Only shares 'russian' tag, different collection
      };

      const collections: CollectionData[] = [
        {
          slug: 'chatbots',
          title: 'Chatbots',
          description: 'AI Chatbots',
          seoDescription: 'AI Chatbots',
          icon: '🤖',
          filterTag: 'chatbot',
          order: 1
        }
      ];

      const allTools = [currentTool, sameCollectionTool, tagOnlyTool];
      const related = findRelatedToolsWithCollections(currentTool, allTools, collections, 4);

      // Same collection tool should come first
      if (related.length >= 2) {
        expect(related[0].slug).toBe('same-collection');
      }
    });

    it('should only return tools with some relevance (shared collections or tags)', () => {
      fc.assert(
        fc.property(
          toolDataArbitrary,
          fc.array(toolDataArbitrary, { minLength: 1, maxLength: 10 }),
          fc.array(collectionDataArbitrary, { minLength: 0, maxLength: 3 }),
          (currentTool, otherTools, collections) => {
            const allTools = [currentTool, ...otherTools];
            const related = findRelatedToolsWithCollections(currentTool, allTools, collections, 4);
            
            const currentCollections = getCollectionsForTool(currentTool, collections);
            const currentCollectionSlugs = new Set(currentCollections.map(c => c.slug));
            
            // Each related tool should have either shared collections or shared tags
            for (const tool of related) {
              const toolCollections = getCollectionsForTool(tool, collections);
              const sharedCollections = toolCollections.filter(c => currentCollectionSlugs.has(c.slug)).length;
              const sharedTags = tool.tags.filter(tag => currentTool.tags.includes(tag)).length;
              
              expect(sharedCollections + sharedTags).toBeGreaterThan(0);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
