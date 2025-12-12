# Design Document: Landing Page V2

## Overview

Редизайн главной страницы каталога `/catalog` в полноценную Landing Page. Текущая страница показывает простой список инструментов. Новая версия добавит hero-секцию со статистикой, featured блоки с фильтрованным контентом, улучшенную навигацию по категориям и информативный footer.

Все компоненты используют IDS (Intuition Design System) — Wrapper, Space, Sequence, SequenceItem, Rounded, Sleepy, TextWidth, Aside.

## Architecture

```
src/pages/catalog/index.astro (обновлённая Landing Page)
├── HeroSection.astro (новый компонент)
│   ├── StatsCounter.astro (новый компонент)
│   └── QuickFilters.astro (новый компонент)
├── FeaturedCategories.astro (новый компонент)
├── TopToolsSection.astro (новый компонент)
├── NewToolsSection.astro (новый компонент)
├── NoVpnSection.astro (новый компонент)
├── RussianCardsSection.astro (новый компонент)
└── Footer.astro (новый компонент)
```

### Файловая структура

```
src/
├── components/
│   └── landing/
│       ├── HeroSection.astro
│       ├── StatsCounter.astro
│       ├── QuickFilters.astro
│       ├── FeaturedCategories.astro
│       ├── TopToolsSection.astro
│       ├── NewToolsSection.astro
│       ├── FeaturedToolsSection.astro (универсальный)
│       └── Footer.astro
├── lib/
│   └── landing.ts (функции выборки данных)
└── pages/
    └── catalog/
        └── index.astro
```

## Components and Interfaces

### HeroSection.astro

```typescript
interface Props {
  toolsCount: number;
  categoriesCount: number;
}
```

Содержит:
- Заголовок h1 "AI Каталог для СНГ" (класс `.S` для меньшего размера)
- Подзаголовок p.loud с описанием
- SearchWidget компонент
- StatsCounter с анимацией
- QuickFilters с кнопками быстрой фильтрации

Использует IDS: `TextWidth`, `Space`, `Sleepy`

### StatsCounter.astro

```typescript
interface Props {
  toolsCount: number;
  categoriesCount: number;
}
```

Отображает:
- "X инструментов" 
- "Y категорий"
- "Обновлено сегодня" badge

Использует IDS: `Sequence`, `SequenceItem`, `Sleepy` для анимации появления

### QuickFilters.astro

```typescript
interface Props {
  // Без пропсов, статичные кнопки
}
```

Кнопки-ссылки:
- "Без VPN" → `/catalog?filter=no-vpn`
- "Карты РФ" → `/catalog?filter=russian-cards`
- "Бесплатные" → `/catalog?filter=free`

Использует IDS: стили `.ids__promo-link`

### FeaturedCategories.astro

```typescript
interface Props {
  categories: CollectionData[];
  tools: ToolData[];
}
```

Сетка карточек категорий с:
- Иконкой категории
- Названием
- Кратким описанием
- Badge с количеством инструментов

Использует IDS: `Sequence`, `SequenceItem`, `Rounded`

### FeaturedToolsSection.astro

```typescript
interface Props {
  title: string;
  tools: ToolData[];
  viewAllLink?: string;
  viewAllText?: string;
}
```

Универсальный компонент для секций "Топ недели", "Новые", "Без VPN", "Карты РФ".

Использует IDS: `Space`, `Sequence`, `SequenceItem`, `Rounded`, `Aside`

### Footer.astro

```typescript
interface Props {
  categories: CollectionData[];
}
```

Содержит:
- Ссылки на все категории
- Ссылки на статические страницы
- Copyright
- Социальные ссылки

Использует IDS: `Wrapper`, `Sequence`, `SequenceItem`

## Data Models

### Функции выборки данных (lib/landing.ts)

```typescript
// Получить топ N инструментов по рейтингу
export function getTopRatedTools(tools: ToolData[], count: number): ToolData[]

// Получить N последних добавленных инструментов
export function getRecentTools(tools: ToolData[], count: number): ToolData[]

// Получить инструменты без VPN
export function getNoVpnTools(tools: ToolData[]): ToolData[]

// Получить инструменты с картами РФ
export function getRussianCardsTools(tools: ToolData[]): ToolData[]

// Подсчитать статистику
export function getStats(tools: ToolData[], categories: CollectionData[]): {
  toolsCount: number;
  categoriesCount: number;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

После анализа prework, выявлены следующие группы свойств:
- Свойства 3.1 и 3.2 (топ по рейтингу и новые) — разные критерии сортировки, не redundant
- Свойства 4.1 и 4.2 (без VPN и карты РФ) — разные фильтры, не redundant
- Свойства 2.2 и 3.3 (поля в карточках) — можно объединить в одно свойство о полноте данных в карточках

### Properties

**Property 1: Stats counter accuracy**
*For any* set of tools and categories, the stats counters SHALL display the exact count of tools and categories in the dataset.
**Validates: Requirements 1.2**

**Property 2: All categories displayed**
*For any* set of categories, the FeaturedCategories component SHALL render a card for each category in the set.
**Validates: Requirements 2.1**

**Property 3: Category card completeness**
*For any* category, the rendered category card SHALL contain the category's icon, title, description, and correct tool count.
**Validates: Requirements 2.2**

**Property 4: Top rated selection**
*For any* set of tools with ratings, the TopToolsSection SHALL display exactly the N tools with highest ratings, sorted descending.
**Validates: Requirements 3.1**

**Property 5: Recent tools selection**
*For any* set of tools with publishedAt dates, the NewToolsSection SHALL display exactly the N most recently published tools, sorted by date descending.
**Validates: Requirements 3.2**

**Property 6: Tool card completeness**
*For any* tool, the rendered tool card SHALL contain the tool's cover image, title, rating (if present), and at least one badge.
**Validates: Requirements 3.3**

**Property 7: No VPN filter correctness**
*For any* set of tools, the NoVpnSection SHALL display only tools where requiresVpn equals false, and SHALL include all such tools.
**Validates: Requirements 4.1**

**Property 8: Russian cards filter correctness**
*For any* set of tools, the RussianCardsSection SHALL display only tools where acceptsRussianCards equals true, and SHALL include all such tools.
**Validates: Requirements 4.2**

**Property 9: Footer category links completeness**
*For any* set of categories, the Footer SHALL contain a link to each category page.
**Validates: Requirements 5.1**

## Error Handling

- Если нет инструментов в категории — показать пустое состояние с сообщением
- Если нет инструментов без VPN — скрыть секцию
- Если нет инструментов с картами РФ — скрыть секцию
- Если изображение не загрузилось — показать placeholder

## Testing Strategy

### Property-Based Testing

Используем **fast-check** для property-based тестов в Vitest.

Каждый property-based тест должен:
1. Генерировать случайные данные (tools, categories)
2. Вызывать тестируемую функцию
3. Проверять инвариант

Минимум 100 итераций на тест.

Формат комментария: `**Feature: landing-page-v2, Property {N}: {description}**`

### Unit Tests

Unit тесты для:
- Проверки рендеринга компонентов с фиксированными данными
- Edge cases: пустые массивы, один элемент, все элементы одинаковые
- Проверки наличия обязательных элементов в DOM

### Тестовые файлы

```
src/__tests__/properties/
├── landingStats.property.test.ts
├── landingCategories.property.test.ts
├── landingTopTools.property.test.ts
├── landingRecentTools.property.test.ts
├── landingNoVpn.property.test.ts
├── landingRussianCards.property.test.ts
└── landingFooter.property.test.ts
```

