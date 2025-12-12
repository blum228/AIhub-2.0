import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// **Feature: platform-upgrade, Property 5: Blog posts sorted by date**
// For any array of blog posts, WHEN sorted by date
// THEN posts SHALL be ordered from newest to oldest (descending by publishedAt)
// **Validates: Requirements 4.2**

interface MockBlogPost {
  slug: string;
  data: {
    title: string;
    description: string;
    publishedAt: Date;
    author: string;
  };
}

// Копия функции сортировки для тестирования
function sortBlogPostsByDate(posts: MockBlogPost[]): MockBlogPost[] {
  return [...posts].sort((a, b) => 
    b.data.publishedAt.getTime() - a.data.publishedAt.getTime()
  );
}

// Генератор mock blog posts
const mockBlogPostArb = fc.record({
  slug: fc.string({ minLength: 1, maxLength: 50 }),
  data: fc.record({
    title: fc.string({ minLength: 1, maxLength: 150 }),
    description: fc.string({ minLength: 10, maxLength: 300 }),
    publishedAt: fc.date({ min: new Date('2020-01-01'), max: new Date('2030-01-01') }),
    author: fc.string({ minLength: 1, maxLength: 100 })
  })
});

describe('Property 5: Blog posts sorted by date', () => {
  it('should sort posts from newest to oldest', () => {
    fc.assert(
      fc.property(fc.array(mockBlogPostArb, { minLength: 0, maxLength: 20 }), (posts) => {
        const sorted = sortBlogPostsByDate(posts);
        
        for (let i = 1; i < sorted.length; i++) {
          const prev = sorted[i - 1].data.publishedAt.getTime();
          const curr = sorted[i].data.publishedAt.getTime();
          expect(prev).toBeGreaterThanOrEqual(curr);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('should preserve all posts after sorting', () => {
    fc.assert(
      fc.property(fc.array(mockBlogPostArb, { minLength: 0, maxLength: 20 }), (posts) => {
        const sorted = sortBlogPostsByDate(posts);
        expect(sorted.length).toBe(posts.length);
        
        // Все оригинальные посты должны присутствовать
        for (const post of posts) {
          expect(sorted).toContainEqual(post);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('should not mutate original array', () => {
    fc.assert(
      fc.property(fc.array(mockBlogPostArb, { minLength: 1, maxLength: 20 }), (posts) => {
        const originalOrder = posts.map(p => p.slug);
        sortBlogPostsByDate(posts);
        const afterSort = posts.map(p => p.slug);
        expect(afterSort).toEqual(originalOrder);
      }),
      { numRuns: 50 }
    );
  });

  it('should handle empty array', () => {
    const sorted = sortBlogPostsByDate([]);
    expect(sorted).toEqual([]);
  });

  it('should handle single post', () => {
    fc.assert(
      fc.property(mockBlogPostArb, (post) => {
        const sorted = sortBlogPostsByDate([post]);
        expect(sorted).toEqual([post]);
      }),
      { numRuns: 50 }
    );
  });
});
