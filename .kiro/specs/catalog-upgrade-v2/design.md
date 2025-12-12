# Design Document: AI Catalog CIS v2 Upgrade

## Overview

Апгрейд каталога AI-сервисов с добавлением системы коллекций, расширенной SEO-структуры и улучшенного UX для русскоязычной аудитории. Все компоненты строятся на IDS (Intuition Design System).

Ключевые изменения:
- Система коллекций/категорий с отдельными страницами
- Breadcrumbs и развитая структура внутренних ссылок
- Генерация placeholder-изображений
- Расширенные бейджи оплаты и доступности
- Таблицы сравнения на страницах категорий
- Расширенная schema.org разметка

## Architecture

```mermaid
graph TB
    subgraph "Content Layer"
        MDX[Tool MDX Files]
        COL[Collection MDX Files]
        KS[Keystatic CMS]
    end
    
    subgraph "Build Layer"
        AC[Astro Content Collections]
        PH[Placeholder Generator]
        AB[Astro Build]
    end
    
    subgraph "Pages"
        HP[Homepage<br/>/catalog]
        CP[Category Pages<br/>/category/[slug]]
        TP[Tool Pages<br/>/tool/[slug]]
        TG[Telegram Page<br/>/telegram-bots]
    end
    
    subgraph "Components (IDS)"
        CC[CategoryCard]
        TC[ToolCard v2]
        BC[Breadcrumbs]
        CT[ComparisonTable]
        PB[PaymentBadges]
        FT[Footer v2]
    end
    
    KS --> MDX
    KS --> COL
    MDX --> AC
    COL --> AC
    AC --> AB
    PH --> AB
    
    AB --> HP
    AB --> CP
    AB --> TP
    AB --> TG
    
    HP --> CC
    HP --> TC
    CP --> TC
    CP --> CT
    CP --> BC
    TP --> BC
    TP --> PB
```

## Components and Interfaces

### Структура проекта (дополнения)

```
src/
├── content/
│   ├── tools/              # Существующие MDX-файлы
│   └── collections/        # НОВОЕ: Коллекции/категории
│       ├── ai-girlfriends.mdx
│       ├── image-generators.mdx
│       ├── telegram-bots.mdx
│       ├── free-tools.mdx
│       └── russian-friendly.mdx
├── components/
│   └── catalog/
│       ├── CategoryCard.astro      # НОВОЕ
│       ├── Breadcrumbs.astro       # НОВОЕ
│       ├── ComparisonTable.astro   # НОВОЕ
│       ├── PaymentBadges.astro     # НОВОЕ
│       ├── AccessBadges.astro      # НОВОЕ
│       ├── PlaceholderImage.astro  # НОВОЕ
│       ├── CategorySidebar.astro   # НОВОЕ
│       ├── FooterNav.astro         # НОВОЕ
│       └── TelegramGuide.astro     # НОВОЕ
├── pages/
│   ├── category/
│   │   └── [slug].astro    # НОВОЕ: Страницы категорий
│   └── ...
└── lib/
    ├── collections.ts      # НОВОЕ: Утилиты для коллекций
    └── placeholder.ts      # НОВОЕ: Генератор placeholder
```

### Новые компоненты

#### CategoryCard.astro
Карточка категории на главной странице. Использует IDS `Rounded` и `Sleepy`.

```typescript
interface CategoryCardProps {
  slug: string;
  title: string;
  description: string;
  icon: string;           // Emoji или путь к иконке
  toolCount: number;      // Количество инструментов
  featured?: boolean;     // Выделенная категория
}
```

Стилизация: IDS `Sequence` для сетки, `Rounded` для карточек, CSS-переменные `--ids__surface-RGB`.

#### Breadcrumbs.astro
Навигационная цепочка для SEO и UX.

```typescript
interface BreadcrumbsProps {
  items: Array<{
    label: string;
    href?: string;        // Если нет — текущая страница
  }>;
}
```

Пример: `Главная → AI Girlfriends → CrushOn AI`

#### ComparisonTable.astro
Таблица сравнения инструментов в категории.

```typescript
interface ComparisonTableProps {
  tools: ToolData[];
  columns: Array<'title' | 'priceModel' | 'acceptsRussianCards' | 'requiresVpn' | 'supportsRussian' | 'rating'>;
}
```

Стилизация: IDS таблица с `--ids__surface-RGB` для чередования строк.

#### PaymentBadges.astro
Бейджи способов оплаты.

```typescript
interface PaymentBadgesProps {
  acceptsRussianCards: boolean;
  paymentMethods?: string[];
  priceModel: 'free' | 'freemium' | 'paid';
}
```

Бейджи:
- 💳 Карты РФ (зелёный, если true)
- 🪙 Крипто
- 🆓 Бесплатно
- ⚡ СБП (если в paymentMethods)

#### AccessBadges.astro
Бейджи доступности из России.

```typescript
interface AccessBadgesProps {
  requiresVpn: boolean;
  supportsRussian: boolean;
}
```

Бейджи:
- ✅ Без VPN (зелёный) / ⚠️ Нужен VPN (жёлтый)
- 🇷🇺 Русский язык

#### PlaceholderImage.astro
SVG-placeholder для инструментов без изображения.

```typescript
interface PlaceholderImageProps {
  title: string;
  category?: string;
  width?: number;
  height?: number;
}
```

Генерирует SVG с названием инструмента и иконкой категории на фоне `--ids__surface-RGB`.

#### TelegramGuide.astro
Пошаговый гайд для Telegram-ботов.

```typescript
interface TelegramGuideProps {
  botLink: string;
  botName: string;
}
```

Шаги:
1. Откройте бота в Telegram
2. Нажмите "Start"
3. Следуйте инструкциям бота

## Data Models

### Collection Schema (новая коллекция)

```typescript
// src/content/config.ts - дополнение
const collectionsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    seoDescription: z.string(),    // Для meta description
    icon: z.string(),              // Emoji
    filterTag: z.string(),         // Тег для фильтрации tools
    filterField: z.string().optional(), // Поле для фильтрации (acceptsRussianCards, etc.)
    filterValue: z.any().optional(),    // Значение для фильтрации
    order: z.number().default(0),  // Порядок отображения
  })
});
```

### Обновлённый Tool Schema

```typescript
// Добавляем поле collections
const toolsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // ... существующие поля ...
    collections: z.array(z.string()).optional(), // Явная привязка к коллекциям
  })
});
```

### Предустановленные коллекции

| Slug | Title | filterTag/Field | Icon |
|------|-------|-----------------|------|
| ai-girlfriends | AI Girlfriends | chatbot | 💕 |
| image-generators | Генераторы изображений | image-gen | 🎨 |
| telegram-bots | Telegram боты | telegram-bot | 🤖 |
| free-tools | Бесплатные | priceModel=free | 🆓 |
| russian-friendly | Принимают карты РФ | acceptsRussianCards=true | 💳 |

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Based on the prework analysis, redundant properties have been consolidated:

### Property 1: Category tool count accuracy

*For any* collection and *any* set of tools, the tool count displayed on the category card SHALL equal the actual number of tools matching that collection's filter criteria.

**Validates: Requirements 1.1**

### Property 2: Category page filtering correctness

*For any* category page, all displayed tools SHALL match the category's filter criteria (tag or field value), and no tools matching the criteria SHALL be excluded.

**Validates: Requirements 1.2, 4.3, 8.2, 8.4**

### Property 3: Breadcrumbs structure validity

*For any* tool page, the breadcrumbs SHALL contain exactly 3 items: Home link, Category link (based on tool's primary tag), and current tool name (no link).

**Validates: Requirements 2.1**

### Property 4: Related tools category matching

*For any* tool page, all tools in the "Related" section SHALL share at least one tag with the current tool, and the current tool SHALL NOT appear in its own related section.

**Validates: Requirements 2.2, 2.5**

### Property 5: Footer category links completeness

*For any* page, the footer SHALL contain links to all defined collections, and each link SHALL point to a valid category page URL.

**Validates: Requirements 2.4**

### Property 6: Placeholder generation for missing images

*For any* tool where coverImage is empty or undefined, the rendered card SHALL display a placeholder element containing the tool's title text.

**Validates: Requirements 3.1**

### Property 7: Payment badges correctness

*For any* tool, the rendered card SHALL display:
- "Карты РФ" badge IF AND ONLY IF acceptsRussianCards is true
- "Бесплатно" badge IF AND ONLY IF priceModel is "free"
- Payment method badges matching the paymentMethods array

**Validates: Requirements 4.1, 4.2**

### Property 8: VPN access badges correctness

*For any* tool, the rendered card SHALL display:
- "Без VPN" badge IF AND ONLY IF requiresVpn is false
- "Нужен VPN" badge IF AND ONLY IF requiresVpn is true

**Validates: Requirements 9.1, 9.2**

### Property 9: Telegram bot button presence

*For any* tool tagged as "telegram-bot" with a non-empty telegramBotLink, the rendered card and page SHALL display a "Открыть в Telegram" button linking to telegramBotLink.

**Validates: Requirements 5.2**

### Property 10: Telegram guide presence

*For any* tool page where the tool is tagged as "telegram-bot", the page SHALL contain a step-by-step guide section.

**Validates: Requirements 5.4**

### Property 11: Comparison table row links

*For any* category page with a comparison table, each row SHALL be a clickable link to the corresponding tool's page URL.

**Validates: Requirements 6.1, 6.3**

### Property 12: CollectionPage schema.org validity

*For any* category page, the rendered HTML SHALL contain a valid JSON-LD script with "@type": "CollectionPage" and itemListElement array matching the displayed tools.

**Validates: Requirements 7.1**

### Property 13: BreadcrumbList schema.org validity

*For any* tool page, the rendered HTML SHALL contain a valid JSON-LD script with "@type": "BreadcrumbList" and itemListElement matching the breadcrumbs structure.

**Validates: Requirements 7.2**

### Property 14: Sitemap completeness

*For any* set of tools and collections, the generated sitemap SHALL contain URLs for all tool pages AND all category pages.

**Validates: Requirements 7.3**

### Property 15: Hreflang tag presence

*For any* page, the rendered HTML SHALL contain a link tag with hreflang="ru-RU" attribute.

**Validates: Requirements 7.4**

### Property 16: FAQ schema.org conditional presence

*For any* tool page where the tool has a non-empty FAQ array, the rendered HTML SHALL contain a valid JSON-LD script with "@type": "FAQPage".

**Validates: Requirements 7.5**

### Property 17: Access info section presence

*For any* tool page, the rendered HTML SHALL contain a section with information about accessing the tool from Russia (VPN requirements, payment methods).

**Validates: Requirements 9.4**

## Error Handling

### Content Errors

| Error | Handling |
|-------|----------|
| Collection with no matching tools | Display empty state with message |
| Tool with invalid collection reference | Ignore invalid reference, log warning |
| Missing coverImage | Generate placeholder SVG |
| Invalid telegramBotLink | Hide Telegram button |

### Runtime Errors

| Error | Handling |
|-------|----------|
| Image load failure | Show placeholder via onerror handler |
| Missing collection page | 404 with suggestion to browse catalog |

## Testing Strategy

### Property-Based Testing Library

**Library**: fast-check (TypeScript) — уже настроен в проекте.

### Test Structure (дополнения)

```
src/__tests__/properties/
├── categoryCount.property.test.ts    # Property 1
├── categoryFilter.property.test.ts   # Property 2
├── breadcrumbs.property.test.ts      # Property 3
├── relatedTools.property.test.ts     # Property 4
├── footerLinks.property.test.ts      # Property 5
├── placeholder.property.test.ts      # Property 6
├── paymentBadges.property.test.ts    # Property 7
├── accessBadges.property.test.ts     # Property 8
├── telegramButton.property.test.ts   # Property 9
├── telegramGuide.property.test.ts    # Property 10
├── comparisonTable.property.test.ts  # Property 11
├── collectionSchema.property.test.ts # Property 12
├── breadcrumbSchema.property.test.ts # Property 13
├── sitemapV2.property.test.ts        # Property 14
├── hreflang.property.test.ts         # Property 15
├── faqSchema.property.test.ts        # Property 16
└── accessInfo.property.test.ts       # Property 17
```

### Generators (дополнения)

```typescript
// Collection generator
const collectionArbitrary = fc.record({
  slug: fc.stringMatching(/^[a-z-]+$/),
  title: fc.string({ minLength: 1, maxLength: 50 }),
  description: fc.string({ minLength: 10, maxLength: 200 }),
  icon: fc.constantFrom('💕', '🎨', '🤖', '🆓', '💳'),
  filterTag: fc.constantFrom('chatbot', 'image-gen', 'telegram-bot'),
  order: fc.integer({ min: 0, max: 10 })
});

// Tool with collections generator
const toolWithCollectionsArbitrary = fc.record({
  ...toolArbitrary.fields,
  collections: fc.array(
    fc.constantFrom('ai-girlfriends', 'image-generators', 'telegram-bots', 'free-tools', 'russian-friendly'),
    { minLength: 0, maxLength: 3 }
  )
});
```

### Test Configuration

- Minimum 100 iterations per property test
- Each test annotated with: `// **Feature: catalog-upgrade-v2, Property {N}: {description}**`
