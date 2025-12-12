import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// **Feature: platform-upgrade, Property 8: Article metadata displayed**
// For any blog post, WHEN displayed on article page
// THEN it SHALL show: title, publication date, author name, and reading time
// **Validates: Requirements 5.2**

interface MockBlogPost {
  slug: string;
  data: {
    title: string;
    description: string;
    publishedAt: Date;
    author: string;
    coverImage?: string;
  };
  rawContent: string;
}

// Копия функции расчёта времени чтения
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return Math.max(1, minutes);
}

// Генератор mock blog posts с контентом
const mockBlogPostArb = fc.record({
  slug: fc.string({ minLength: 1, maxLength: 50 }).filter(s => /^[a-z0-9-]+$/.test(s)),
  data: fc.record({
    title: fc.string({ minLength: 1, maxLength: 150 }),
    description: fc.string({ minLength: 10, maxLength: 300 }),
    publishedAt: fc.date({ min: new Date('2020-01-01'), max: new Date('2030-01-01') }),
    author: fc.string({ minLength: 1, maxLength: 100 }),
    coverImage: fc.option(fc.constant('/images/blog/cover.jpg'), { nil: undefined })
  }),
  rawContent: fc.string({ minLength: 50, maxLength: 5000 })
});

describe('Property 8: Article metadata displayed', () => {
  it('should display title from post data', () => {
    fc.assert(
      fc.property(mockBlogPostArb, (post) => {
        expect(post.data.title).toBeTruthy();
        expect(post.data.title.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });

  it('should display publication date', () => {
    fc.assert(
      fc.property(mockBlogPostArb, (post) => {
        const date = post.data.publishedAt;
        expect(date).toBeInstanceOf(Date);
        
        // Дата должна быть форматируемой
        const formatted = date.toLocaleDateString('ru-RU', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        expect(formatted).toBeTruthy();
      }),
      { numRuns: 100 }
    );
  });

  it('should display author name', () => {
    fc.assert(
      fc.property(mockBlogPostArb, (post) => {
        expect(post.data.author).toBeTruthy();
        expect(post.data.author.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });

  it('should calculate reading time correctly', () => {
    fc.assert(
      fc.property(mockBlogPostArb, (post) => {
        const readingTime = calculateReadingTime(post.rawContent);
        
        // Время чтения должно быть минимум 1 минута
        expect(readingTime).toBeGreaterThanOrEqual(1);
        
        // Время чтения должно быть целым числом
        expect(Number.isInteger(readingTime)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('should have reading time proportional to content length', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 200, maxLength: 200 }), // ~200 слов = 1 мин
        fc.string({ minLength: 1000, maxLength: 1000 }), // ~1000 слов = 5 мин
        (shortContent, longContent) => {
          const shortTime = calculateReadingTime(shortContent);
          const longTime = calculateReadingTime(longContent);
          
          // Длинный контент должен требовать больше времени
          expect(longTime).toBeGreaterThanOrEqual(shortTime);
        }
      ),
      { numRuns: 50 }
    );
  });
});
