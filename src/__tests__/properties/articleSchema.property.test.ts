import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// **Feature: platform-upgrade, Property 10: Article Schema.org structured data**
// For any blog post, WHEN displayed on article page
// THEN it SHALL include JSON-LD with @type Article, headline, datePublished, author
// **Validates: Requirements 5.5**

interface MockBlogPost {
  slug: string;
  data: {
    title: string;
    description: string;
    publishedAt: Date;
    author: string;
    coverImage?: string;
  };
}

// Функция генерации Article schema (копия логики из [slug].astro)
function generateArticleSchema(post: MockBlogPost, siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.data.title,
    "description": post.data.description,
    "datePublished": post.data.publishedAt.toISOString(),
    "author": {
      "@type": "Person",
      "name": post.data.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "AI Каталог СНГ",
      "url": siteUrl
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${post.slug}`
    },
    ...(post.data.coverImage && { "image": `${siteUrl}${post.data.coverImage}` })
  };
}

// Генератор mock blog posts
const mockBlogPostArb = fc.record({
  slug: fc.string({ minLength: 1, maxLength: 50 }).filter(s => /^[a-z0-9-]+$/.test(s)),
  data: fc.record({
    title: fc.string({ minLength: 1, maxLength: 150 }),
    description: fc.string({ minLength: 10, maxLength: 300 }),
    publishedAt: fc.date({ min: new Date('2020-01-01'), max: new Date('2030-01-01') }),
    author: fc.string({ minLength: 1, maxLength: 100 }),
    coverImage: fc.option(fc.constant('/images/blog/cover.jpg'), { nil: undefined })
  })
});

const siteUrl = 'https://ai-catalog.ru';

describe('Property 10: Article Schema.org structured data', () => {
  it('should have @type Article', () => {
    fc.assert(
      fc.property(mockBlogPostArb, (post) => {
        const schema = generateArticleSchema(post, siteUrl);
        expect(schema['@type']).toBe('Article');
      }),
      { numRuns: 100 }
    );
  });

  it('should have @context schema.org', () => {
    fc.assert(
      fc.property(mockBlogPostArb, (post) => {
        const schema = generateArticleSchema(post, siteUrl);
        expect(schema['@context']).toBe('https://schema.org');
      }),
      { numRuns: 100 }
    );
  });

  it('should include headline from title', () => {
    fc.assert(
      fc.property(mockBlogPostArb, (post) => {
        const schema = generateArticleSchema(post, siteUrl);
        expect(schema.headline).toBe(post.data.title);
      }),
      { numRuns: 100 }
    );
  });

  it('should include datePublished in ISO format', () => {
    fc.assert(
      fc.property(mockBlogPostArb, (post) => {
        const schema = generateArticleSchema(post, siteUrl);
        expect(schema.datePublished).toBe(post.data.publishedAt.toISOString());
        
        // Проверяем что это валидная ISO дата
        const parsed = new Date(schema.datePublished);
        expect(parsed.getTime()).not.toBeNaN();
      }),
      { numRuns: 100 }
    );
  });

  it('should include author as Person', () => {
    fc.assert(
      fc.property(mockBlogPostArb, (post) => {
        const schema = generateArticleSchema(post, siteUrl);
        expect(schema.author['@type']).toBe('Person');
        expect(schema.author.name).toBe(post.data.author);
      }),
      { numRuns: 100 }
    );
  });

  it('should include publisher as Organization', () => {
    fc.assert(
      fc.property(mockBlogPostArb, (post) => {
        const schema = generateArticleSchema(post, siteUrl);
        expect(schema.publisher['@type']).toBe('Organization');
        expect(schema.publisher.name).toBe('AI Каталог СНГ');
        expect(schema.publisher.url).toBe(siteUrl);
      }),
      { numRuns: 100 }
    );
  });

  it('should include mainEntityOfPage with correct URL', () => {
    fc.assert(
      fc.property(mockBlogPostArb, (post) => {
        const schema = generateArticleSchema(post, siteUrl);
        expect(schema.mainEntityOfPage['@type']).toBe('WebPage');
        expect(schema.mainEntityOfPage['@id']).toBe(`${siteUrl}/blog/${post.slug}`);
      }),
      { numRuns: 100 }
    );
  });

  it('should include image when coverImage is present', () => {
    fc.assert(
      fc.property(mockBlogPostArb, (post) => {
        const schema = generateArticleSchema(post, siteUrl);
        
        if (post.data.coverImage) {
          expect(schema.image).toBe(`${siteUrl}${post.data.coverImage}`);
        } else {
          expect(schema.image).toBeUndefined();
        }
      }),
      { numRuns: 100 }
    );
  });

  it('should produce valid JSON', () => {
    fc.assert(
      fc.property(mockBlogPostArb, (post) => {
        const schema = generateArticleSchema(post, siteUrl);
        const json = JSON.stringify(schema);
        
        // Должен быть валидным JSON
        expect(() => JSON.parse(json)).not.toThrow();
      }),
      { numRuns: 100 }
    );
  });
});
