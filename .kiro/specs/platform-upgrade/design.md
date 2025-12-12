# Design Document: Platform Upgrade

## Overview

Апгрейд AI-каталога включает три ключевых направления:
1. **Landing Page** — привлекательная главная страница с hero-секцией, featured tools, категориями и превью блога
2. **Глобальная навигация** — единый header и footer для всех страниц с адаптивным мобильным меню
3. **Блог-система** — индексная страница, страницы статей и MDX-контент коллекция

Все компоненты используют IDS (Intuition Design System) и ориентированы на русскоязычную аудиторию СНГ.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      BaseLayout.astro                        │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                   GlobalHeader.astro                     ││
│  │  [Logo] [Home] [Catalog] [Blog] [About] [SafeMode]      ││
│  │  Mobile: [Logo] [Hamburger] → MobileNav overlay         ││
│  └─────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    Page Content                          ││
│  │  - Landing Page (/)                                      ││
│  │  - Catalog (/catalog)                                    ││
│  │  - Blog Index (/blog)                                    ││
│  │  - Blog Post (/blog/[slug])                              ││
│  │  - Tool Page (/tool/[slug])                              ││
│  │  - Category (/category/[slug])                           ││
│  └─────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                   GlobalFooter.astro                     ││
│  │  [Nav Groups] [Category Links] [Copyright]              ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

```
Content Collections
├── tools/           → ToolData[]
├── collections/     → CollectionData[]
└── blog/            → BlogPostData[]
         │
         ▼
    Astro Pages
         │
    ┌────┴────┐
    ▼         ▼
Landing    Blog Index
    │         │
    ▼         ▼
Featured   Post Cards
Tools      (sorted by date)
(top 4)
```

## Components and Interfaces

### New Components

#### 1. GlobalHeader.astro
```typescript
interface Props {
  currentPath?: string;
}
```
- Отображает логотип и навигационные ссылки
- На мобильных (< 768px) показывает hamburger menu
- Включает SafeModeToggle

#### 2. MobileNav.astro
```typescript
interface Props {
  isOpen: boolean;
}
```
- Full-screen overlay для мобильной навигации
- Закрывается при клике на ссылку или кнопку закрытия

#### 3. GlobalFooter.astro
```typescript
interface Props {
  collections: CollectionData[];
}
```
- Навигационные ссылки по секциям
- Ссылки на все категории
- Copyright с текущим годом

#### 4. HeroSection.astro
```typescript
interface Props {
  headline: string;
  description: string;
  ctaText: string;
  ctaLink: string;
}
```
- Hero-секция для landing page
- Использует IDS компоненты: Wrapper, TextWidth, Space

#### 5. FeaturedTools.astro
```typescript
interface Props {
  tools: ToolData[];
  limit?: number; // default: 4
}
```
- Отображает топ инструментов по рейтингу
- Использует Sequence и ToolCard

#### 6. HowItWorks.astro
```typescript
interface Props {
  steps: { title: string; description: string; icon?: string }[];
}
```
- Секция "Как это работает"
- 3-4 шага с иконками

#### 7. BlogPreview.astro
```typescript
interface Props {
  posts: BlogPostData[];
  limit?: number; // default: 3
}
```
- Превью последних постов блога
- Использует Sequence и BlogCard

#### 8. BlogCard.astro
```typescript
interface Props {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: Date;
  coverImage?: string;
}
```
- Карточка поста для индекса и превью

#### 9. BlogArticle.astro
```typescript
interface Props {
  title: string;
  publishedAt: Date;
  author: string;
  readingTime: number;
  relatedTools?: ToolData[];
}
```
- Обёртка для контента статьи
- Включает метаданные и related tools

### Updated Components

#### CatalogLayout.astro
- Заменить inline header на GlobalHeader
- Заменить FooterNav на GlobalFooter

## Data Models

### BlogPostData (новый)
```typescript
interface BlogPostData {
  slug: string;
  title: string;
  description: string;
  publishedAt: Date;
  author: string;
  coverImage?: string;
  tags?: string[];
  relatedTools?: string[]; // slugs инструментов
  readingTime?: number; // минуты, вычисляется автоматически
}
```

### Blog Content Schema (Zod)
```typescript
const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().min(1).max(150),
    description: z.string().min(10).max(300),
    publishedAt: z.coerce.date(),
    author: z.string().min(1),
    coverImage: z.string().optional(),
    tags: z.array(z.string()).optional(),
    relatedTools: z.array(z.string()).optional()
  })
});
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Featured tools are top-rated
*For any* set of tools with ratings, the featured tools section SHALL contain exactly the top N tools sorted by rating in descending order.
**Validates: Requirements 1.2**

### Property 2: All collections displayed on landing
*For any* set of collections, the landing page category section SHALL display cards for all collections with correct links.
**Validates: Requirements 1.3**

### Property 3: Blog preview limited to 3 posts
*For any* set of blog posts, the landing page blog preview SHALL display at most 3 posts, sorted by publication date descending.
**Validates: Requirements 1.5**

### Property 4: Footer contains all collections
*For any* set of collections, the footer SHALL include links to all collections.
**Validates: Requirements 3.3**

### Property 5: Blog posts sorted by date
*For any* set of blog posts, the blog index SHALL display posts in descending publication date order.
**Validates: Requirements 4.2**

### Property 6: Blog card contains required fields
*For any* blog post, the rendered card SHALL include title, excerpt, date, and cover image (if present).
**Validates: Requirements 4.3**

### Property 7: Blog card links to correct URL
*For any* blog post with slug S, the card link SHALL point to `/blog/S`.
**Validates: Requirements 4.4**

### Property 8: Article metadata displayed
*For any* blog article, the page SHALL display title, publication date, author name, and reading time.
**Validates: Requirements 5.2**

### Property 9: Related tools displayed
*For any* blog article with relatedTools array, the page SHALL display tool cards for all referenced tools that exist.
**Validates: Requirements 5.4**

### Property 10: Article Schema.org structured data
*For any* blog article, the page SHALL include valid JSON-LD with @type "Article" containing required fields (headline, datePublished, author).
**Validates: Requirements 5.5**

### Property 11: Blog schema validation
*For any* valid BlogPostData object, serializing and parsing through the Zod schema SHALL produce an equivalent object. Invalid objects (missing required fields) SHALL be rejected.
**Validates: Requirements 6.2, 6.3, 6.4**

## Error Handling

| Scenario | Handling |
|----------|----------|
| No tools exist | Featured section hidden |
| No blog posts exist | Blog preview section hidden |
| Tool image fails to load | PlaceholderImage fallback |
| Blog post missing coverImage | Default placeholder or no image |
| relatedTools references non-existent tool | Skip that tool, show others |
| Invalid blog post schema | Build-time error from Astro |

## Testing Strategy

### Property-Based Testing
Используем **fast-check** для property-based тестов.

Каждый property-based тест:
- Запускается минимум 100 итераций
- Аннотируется комментарием с номером свойства из design doc
- Тестирует одно конкретное свойство

### Unit Tests
- Тесты для утилитарных функций (сортировка, фильтрация)
- Тесты для schema validation
- Тесты для reading time calculation

### Test Files Structure
```
src/__tests__/
├── properties/
│   ├── featuredTools.property.test.ts    # Property 1
│   ├── landingCollections.property.test.ts # Property 2
│   ├── blogPreview.property.test.ts      # Property 3
│   ├── footerCollections.property.test.ts # Property 4
│   ├── blogSorting.property.test.ts      # Property 5
│   ├── blogCard.property.test.ts         # Properties 6, 7
│   ├── articleMetadata.property.test.ts  # Property 8
│   ├── relatedTools.property.test.ts     # Property 9
│   ├── articleSchema.property.test.ts    # Property 10
│   └── blogSchema.property.test.ts       # Property 11
└── unit/
    └── readingTime.test.ts
```
