# Design Document: Category Page Magazine Redesign

## Overview

Редизайн страницы категорий в стиле модного журнала с акцентом на:
- Крупную выразительную типографику
- Щедрый whitespace для "дыхания" контента
- Чистую визуальную иерархию
- Использование существующих IDS компонентов

Вдохновение: Kinfolk, Monocle, It's Nice That — издания с минималистичным, но выразительным дизайном.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CatalogLayout                          │
├─────────────────────────────────────────────────────────────┤
│  Breadcrumbs                                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              CategoryHero (NEW)                      │   │
│  │  ┌─────────────────────────────────────────────┐    │   │
│  │  │  Icon (emoji, large)                        │    │   │
│  │  │  Title (h1, editorial typography)           │    │   │
│  │  │  Description (lead paragraph)               │    │   │
│  │  │  Tool Count Badge                           │    │   │
│  │  └─────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              ToolGrid (existing)                     │   │
│  │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                    │   │
│  │  │Card │ │Card │ │Card │ │Card │                    │   │
│  │  └─────┘ └─────┘ └─────┘ └─────┘                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           ComparisonTable (existing)                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  TextWidth                                           │   │
│  │  ┌─────────────────────────────────────────────┐    │   │
│  │  │  Editorial Content (MDX)                    │    │   │
│  │  └─────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           RelatedCategories (sidebar)                │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐             │   │
│  │  │ CatCard  │ │ CatCard  │ │ CatCard  │             │   │
│  │  └──────────┘ └──────────┘ └──────────┘             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### CategoryHero (New Component)

Новый компонент для hero-секции страницы категории.

```typescript
interface CategoryHeroProps {
  icon: string;           // Emoji иконка категории
  title: string;          // Название категории
  description: string;    // Описание категории
  toolCount: number;      // Количество инструментов
}
```

**Стилизация:**
- Заголовок: `font-size: 3.6em` (h1 из IDS), `font-weight: 700`
- Описание: `font-size: 1.2em`, `line-height: 1.5`, `opacity: 0.8`
- Иконка: `font-size: 4em`, отдельная строка над заголовком
- Счетчик: pill-badge с `background: rgb(var(--ids__surface-RGB))`
- Spacing: `padding: 3em 0` сверху и снизу

### Updated Category Page Structure

```astro
---
// [slug].astro - обновленная структура
---
<CatalogLayout>
  <script type="application/ld+json" />
  
  <Breadcrumbs items={breadcrumbItems} />
  
  <Space size="M" />

  <CategoryHero
    icon={currentCollection.icon}
    title={currentCollection.title}
    description={currentCollection.description}
    toolCount={filteredTools.length}
  />

  <Space size="L" />

  <main class="category-main">
    <ToolGrid tools={filteredTools} columns="M" />

    <Space size="XL" />

    {filteredTools.length > 1 && (
      <ComparisonTable tools={filteredTools} />
    )}

    <Space size="XL" />

    <TextWidth>
      <section class="category-content ids">
        <Content />
      </section>
    </TextWidth>

    <Space size="XL" />

    <aside class="related-categories">
      <h3 class="related-categories__title">Другие категории</h3>
      <div class="related-categories__grid">
        {otherCollections.map(col => (
          <CategoryCard ... />
        ))}
      </div>
    </aside>
  </main>
</CatalogLayout>
```

## Data Models

Используются существующие модели из `lib/types.ts` и `lib/collections.ts`:

```typescript
// Existing types
interface CollectionData {
  slug: string;
  title: string;
  description: string;
  seoDescription: string;
  icon: string;
  filterTag: string;
  order: number;
}

interface ToolData {
  slug: string;
  title: string;
  shortDescription: string;
  coverImage: string;
  // ... other fields
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing the prework, the following properties were identified as redundant or combinable:
- Properties 2.1 and 2.2 (tool grid rendering) can be combined into one property about tool rendering
- Properties 4.1 and 4.2 (editorial content) can be combined into one property about content wrapper
- Properties 7.1, 7.2, 7.3 (IDS variables) can be combined into one property about CSS variable usage

### Properties

**Property 1: Hero section displays category data correctly**
*For any* category page with valid collection data, the hero section SHALL contain the category title, description, and a tool count that matches the actual number of tools in the collection.
**Validates: Requirements 1.1, 1.2, 1.3**

**Property 2: All collection tools are rendered in the grid**
*For any* category page, the tool grid SHALL render exactly the same number of ToolCard components as there are tools in the filtered collection.
**Validates: Requirements 2.1, 2.2**

**Property 3: Comparison table conditional rendering**
*For any* category page, the ComparisonTable component SHALL be rendered if and only if the collection contains more than one tool.
**Validates: Requirements 3.1**

**Property 4: Editorial content uses IDS wrapper**
*For any* category page with editorial content, the content SHALL be wrapped in a TextWidth component and have the 'ids' class applied for typography styles.
**Validates: Requirements 4.1, 4.2**

**Property 5: Other categories exclude current category**
*For any* category page, the related categories section SHALL display all categories except the current one.
**Validates: Requirements 5.1**

**Property 6: Schema.org structured data is valid**
*For any* category page, the JSON-LD script SHALL contain a valid CollectionPage schema with the correct category name, description, and item count.
**Validates: Requirements 6.1**

**Property 7: Breadcrumbs contain correct navigation path**
*For any* category page, the breadcrumbs SHALL contain at least two items: a link to the catalog and the current category name.
**Validates: Requirements 6.2**

**Property 8: CSS uses IDS design tokens**
*For any* CSS in the category page components, color values SHALL use IDS CSS variables (--ids__*-RGB) instead of hardcoded colors.
**Validates: Requirements 7.1, 7.2, 7.3**

## Error Handling

| Scenario | Handling |
|----------|----------|
| Empty collection (no tools) | Display empty state message, hide comparison table |
| Missing collection icon | Use default emoji or hide icon |
| Missing editorial content | Skip content section, maintain layout |
| Invalid collection slug | 404 page via Astro's getStaticPaths |

## Testing Strategy

### Property-Based Testing

**Library:** fast-check (already used in the project based on existing test files)

**Configuration:** Minimum 100 iterations per property test

**Test Files:**
- `src/__tests__/properties/categoryHero.property.test.ts` - Hero section properties
- `src/__tests__/properties/categoryPage.property.test.ts` - Page-level properties

### Unit Tests

- Test CategoryHero component renders with all props
- Test conditional rendering of ComparisonTable
- Test breadcrumb generation logic
- Test Schema.org JSON-LD generation

### Integration Tests

- Visual regression tests for magazine layout (optional, manual)
- Mobile responsiveness checks (optional, manual)
