# Requirements Document

## Introduction

Комплексная SEO-оптимизация платформы: schema.org разметка для всех типов страниц, улучшенный sitemap, canonical URLs, Open Graph теги и техническая оптимизация.

**Обязательное условие:** Все изменения должны быть совместимы с Astro SSG.

## Glossary

- **Schema.org Markup**: Структурированные данные для поисковых систем
- **Sitemap**: XML-файл со списком всех страниц сайта
- **Canonical URL**: Основной URL страницы для избежания дублирования
- **Open Graph**: Метатеги для превью в соцсетях

## Requirements

### Requirement 1: Schema.org разметка

**User Story:** Как владелец сайта, я хочу rich snippets в поисковой выдаче.

#### Acceptance Criteria

1. WHEN a tool page is rendered THEN the Platform SHALL include Product and AggregateRating schema
2. WHEN a category page is rendered THEN the Platform SHALL include CollectionPage schema
3. WHEN a blog post is rendered THEN the Platform SHALL include Article schema
4. WHEN FAQ section is rendered THEN the Platform SHALL include FAQPage schema
5. WHEN breadcrumbs are rendered THEN the Platform SHALL include BreadcrumbList schema

### Requirement 2: Sitemap

**User Story:** Как владелец сайта, я хочу чтобы все страницы индексировались.

#### Acceptance Criteria

1. THE Platform SHALL generate sitemap.xml with all pages
2. THE sitemap SHALL group URLs by type: tools, categories, blog, guides, static
3. THE sitemap SHALL include lastmod dates for dynamic content
4. THE Platform SHALL generate robots.txt with sitemap reference

### Requirement 3: Meta Tags

**User Story:** Как владелец сайта, я хочу правильные превью при шаринге.

#### Acceptance Criteria

1. WHEN any page is rendered THEN the Platform SHALL include unique meta title and description
2. WHEN any page is rendered THEN the Platform SHALL include Open Graph tags (og:title, og:description, og:image)
3. WHEN any page is rendered THEN the Platform SHALL include canonical URL
4. WHEN any page is rendered THEN the Platform SHALL include hreflang="ru-RU"

### Requirement 4: Техническая оптимизация

**User Story:** Как владелец сайта, я хочу быструю загрузку страниц.

#### Acceptance Criteria

1. THE Platform SHALL implement lazy loading for images below fold
2. THE Platform SHALL use WebP format for images where supported
3. THE Platform SHALL preload critical fonts and styles

