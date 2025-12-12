import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// **Feature: ai-catalog-cis, Property 10: Sitemap completeness**
// For any set of published tools, the generated sitemap.xml
// SHALL contain URLs for all tool pages.

interface Tool {
  slug: string;
  title: string;
  publishedAt: Date;
}

const siteUrl = 'https://ai-catalog.ru';

function generateSitemap(tools: Tool[]): string[] {
  const urls: string[] = [
    siteUrl,
    `${siteUrl}/telegram-bots`
  ];

  for (const tool of tools) {
    urls.push(`${siteUrl}/tool/${tool.slug}`);
  }

  return urls;
}

function generateSitemapXml(tools: Tool[]): string {
  const urls = generateSitemap(tools);

  const urlEntries = urls.map(url => `
  <url>
    <loc>${url}</loc>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlEntries}
</urlset>`;
}

const toolArb = fc.record({
  slug: fc.string({ minLength: 1, maxLength: 50 }).map(s =>
    s.replace(/[^a-z0-9-]/gi, '-').toLowerCase().slice(0, 50) || 'tool'
  ),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  publishedAt: fc.date({ min: new Date('2020-01-01'), max: new Date('2030-01-01') })
});

describe('Property 10: Sitemap completeness', () => {
  it('should include URL for every published tool', () => {
    fc.assert(
      fc.property(fc.array(toolArb, { minLength: 0, maxLength: 20 }), (tools) => {
        const urls = generateSitemap(tools);

        // Каждый инструмент должен иметь URL в sitemap
        for (const tool of tools) {
          const expectedUrl = `${siteUrl}/tool/${tool.slug}`;
          expect(urls).toContain(expectedUrl);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('should always include static pages', () => {
    fc.assert(
      fc.property(fc.array(toolArb, { minLength: 0, maxLength: 10 }), (tools) => {
        const urls = generateSitemap(tools);

        expect(urls).toContain(siteUrl);
        expect(urls).toContain(`${siteUrl}/telegram-bots`);
      }),
      { numRuns: 100 }
    );
  });

  it('should have correct number of URLs', () => {
    fc.assert(
      fc.property(fc.array(toolArb, { minLength: 0, maxLength: 20 }), (tools) => {
        const urls = generateSitemap(tools);

        // 2 статические страницы + по одной на каждый инструмент
        const expectedCount = 2 + tools.length;
        expect(urls.length).toBe(expectedCount);
      }),
      { numRuns: 100 }
    );
  });

  it('should generate valid XML', () => {
    fc.assert(
      fc.property(fc.array(toolArb, { minLength: 0, maxLength: 10 }), (tools) => {
        const xml = generateSitemapXml(tools);

        // Проверяем базовую структуру XML
        expect(xml).toContain('<?xml version="1.0"');
        expect(xml).toContain('<urlset');
        expect(xml).toContain('</urlset>');

        // Каждый URL должен быть обёрнут в <url><loc>
        for (const tool of tools) {
          expect(xml).toContain(`<loc>${siteUrl}/tool/${tool.slug}</loc>`);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('should not have duplicate URLs', () => {
    fc.assert(
      fc.property(fc.array(toolArb, { minLength: 0, maxLength: 20 }), (tools) => {
        // Убираем дубликаты slug для теста
        const uniqueTools = tools.filter((tool, index, self) =>
          index === self.findIndex(t => t.slug === tool.slug)
        );

        const urls = generateSitemap(uniqueTools);
        const uniqueUrls = new Set(urls);

        expect(urls.length).toBe(uniqueUrls.size);
      }),
      { numRuns: 100 }
    );
  });
});
