import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { z } from 'astro/zod';

// **Feature: platform-upgrade, Property 11: Blog schema validation**
// For any blog post data object, IF all required fields are present and valid
// THEN schema validation SHALL pass. IF any required field is missing or invalid
// THEN schema validation SHALL fail with a descriptive error.
// **Validates: Requirements 6.2, 6.3, 6.4**

// Копия схемы для тестирования (без зависимости от Astro Content Collections)
const blogSchema = z.object({
  title: z.string().min(1).max(150),
  description: z.string().min(10).max(300),
  publishedAt: z.coerce.date(),
  author: z.string().min(1),
  coverImage: z.string().optional(),
  tags: z.array(z.string()).optional(),
  relatedTools: z.array(z.string()).optional()
});

// Генератор валидных данных
const validBlogArb = fc.record({
  title: fc.string({ minLength: 1, maxLength: 150 }),
  description: fc.string({ minLength: 10, maxLength: 300 }),
  publishedAt: fc.date({ min: new Date('2020-01-01'), max: new Date('2030-01-01') }),
  author: fc.string({ minLength: 1, maxLength: 100 }),
  coverImage: fc.option(fc.constant('/images/blog/cover.jpg'), { nil: undefined }),
  tags: fc.option(fc.array(fc.string({ minLength: 1 }), { minLength: 0, maxLength: 5 }), { nil: undefined }),
  relatedTools: fc.option(fc.array(fc.string({ minLength: 1 }), { minLength: 0, maxLength: 5 }), { nil: undefined })
});

describe('Property 11: Blog schema validation', () => {
  it('should pass validation for valid blog post data', () => {
    fc.assert(
      fc.property(validBlogArb, (blogData) => {
        const result = blogSchema.safeParse(blogData);
        expect(result.success).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('should fail when title is empty', () => {
    fc.assert(
      fc.property(validBlogArb, (blogData) => {
        const invalid = { ...blogData, title: '' };
        const result = blogSchema.safeParse(invalid);
        expect(result.success).toBe(false);
      }),
      { numRuns: 50 }
    );
  });

  it('should fail when description is too short', () => {
    fc.assert(
      fc.property(validBlogArb, (blogData) => {
        const invalid = { ...blogData, description: 'short' };
        const result = blogSchema.safeParse(invalid);
        expect(result.success).toBe(false);
      }),
      { numRuns: 50 }
    );
  });

  it('should fail when author is empty', () => {
    fc.assert(
      fc.property(validBlogArb, (blogData) => {
        const invalid = { ...blogData, author: '' };
        const result = blogSchema.safeParse(invalid);
        expect(result.success).toBe(false);
      }),
      { numRuns: 50 }
    );
  });

  it('should fail when publishedAt is missing', () => {
    fc.assert(
      fc.property(validBlogArb, (blogData) => {
        const { publishedAt, ...rest } = blogData;
        const result = blogSchema.safeParse(rest);
        expect(result.success).toBe(false);
      }),
      { numRuns: 50 }
    );
  });

  it('should pass when optional fields are undefined', () => {
    fc.assert(
      fc.property(validBlogArb, (blogData) => {
        const minimal = {
          title: blogData.title,
          description: blogData.description,
          publishedAt: blogData.publishedAt,
          author: blogData.author
        };
        const result = blogSchema.safeParse(minimal);
        expect(result.success).toBe(true);
      }),
      { numRuns: 50 }
    );
  });
});
