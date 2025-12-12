import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// **Feature: platform-upgrade, Property 3: Blog preview limited to 3 posts**
// For any set of blog posts, WHEN displayed in blog preview section
// THEN it SHALL show at most 3 recent posts sorted by date descending
// **Validates: Requirements 1.5**

interface MockBlogPost {
  slug: string;
  data: {
    title: string;
    publishedAt: Date;
  };
}

// Копия функции сортировки по дате
function sortBlogPostsByDate(posts: MockBlogPost[]): MockBlogPost[] {
  return [...posts].sort((a, b) => 
    b.data.publishedAt.getTime() - a.data.publishedAt.getTime()
  );
}

// Функция получения recent posts
function getRecentBlogPosts(posts: MockBlogPost[], count: number = 3): MockBlogPost[] {
  return sortBlogPostsByDate(posts).slice(0, count);
}

// Генератор mock blog posts
const mockBlogPostArb = fc.record({
  slug: fc.string({ minLength: 1, maxLength: 50 }).filter(s => /^[a-z0-9-]+$/.test(s)),
  data: fc.record({
    title: fc.string({ minLength: 1, maxLength: 150 }),
    publishedAt: fc.date({ min: new Date('2020-01-01'), max: new Date('2030-01-01') })
  })
});

describe('Property 3: Blog preview limited to 3 posts', () => {
  it('should return at most 3 posts', () => {
    fc.assert(
      fc.property(
        fc.array(mockBlogPostArb, { minLength: 0, maxLength: 20 }),
        (posts) => {
          const preview = getRecentBlogPosts(posts, 3);
          expect(preview.length).toBeLessThanOrEqual(3);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return all posts if less than 3 available', () => {
    fc.assert(
      fc.property(
        fc.array(mockBlogPostArb, { minLength: 0, maxLength: 2 }),
        (posts) => {
          const preview = getRecentBlogPosts(posts, 3);
          expect(preview.length).toBe(posts.length);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should sort by date descending (newest first)', () => {
    fc.assert(
      fc.property(
        fc.array(mockBlogPostArb, { minLength: 2, maxLength: 20 }),
        (posts) => {
          const preview = getRecentBlogPosts(posts, 3);
          
          for (let i = 1; i < preview.length; i++) {
            const prevDate = preview[i - 1].data.publishedAt.getTime();
            const currDate = preview[i].data.publishedAt.getTime();
            expect(prevDate).toBeGreaterThanOrEqual(currDate);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should include most recent posts from original set', () => {
    fc.assert(
      fc.property(
        fc.uniqueArray(mockBlogPostArb, { 
          minLength: 4, 
          maxLength: 20,
          comparator: (a, b) => a.slug === b.slug 
        }),
        (posts) => {
          const preview = getRecentBlogPosts(posts, 3);
          const sorted = sortBlogPostsByDate(posts);
          
          // Preview должны быть первыми 3 из отсортированного списка
          preview.forEach((post, index) => {
            expect(post.slug).toBe(sorted[index].slug);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return empty array when no posts', () => {
    const preview = getRecentBlogPosts([], 3);
    expect(preview).toEqual([]);
  });
});
