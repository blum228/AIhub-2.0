# Design Document: Tool Page Redesign

## Overview

Редизайн страницы сервиса (tool/[slug].astro) для создания профессиональной, SEO-оптимизированной страницы с использованием IDS Design System. Страница должна помогать пользователю принять решение о выборе сервиса и конвертировать в переход на сервис.

Ключевые изменения:
- Улучшенная hero-секция с рейтингом и бейджами
- Компактный блок доступности с семантическими цветами
- Sticky sidebar с CTA и подсказками
- SEO-оптимизация (Product, FAQ, Breadcrumb Schema)
- Мобильная адаптивность с фиксированной CTA

## Architecture

### Структура страницы

```
┌─────────────────────────────────────────────────────────┐
│ Breadcrumbs                                             │
├─────────────────────────────────────────────────────────┤
│ HERO SECTION                                            │
│ ┌─────────────────────┐  ┌────────────────────────────┐ │
│ │                     │  │ Title                      │ │
│ │     Cover Image     │  │ Short Description          │ │
│ │     (Rounded)       │  │ ★ 4.7  |  от $5/мес       │ │
│ │                     │  │ [Badges: VPN, Cards, Lang] │ │
│ │                     │  │ [CTA Button] [Secondary]   │ │
│ └─────────────────────┘  └────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ ACCESS INFO BAR (compact horizontal)                    │
│ VPN: Нужен | Карты РФ: Нет | Язык: EN | Оплата: Крипто │
├─────────────────────────────────────────────────────────┤
│ CONTENT                           │ SIDEBAR (sticky)    │
│ ┌───────────────────────────────┐ │ ┌─────────────────┐ │
│ │ MDX Content                   │ │ │ [CTA Button]    │ │
│ │ - О сервисе                   │ │ │ Цена: от $5     │ │
│ │ - Для кого подходит           │ │ │ ─────────────── │ │
│ │ - Возможности                 │ │ │ Как оплатить:   │ │
│ │ - Плюсы/минусы                │ │ │ Крипто, Pyypl   │ │
│ │ - Тарифы (table)              │ │ │ ─────────────── │ │
│ │ - Как начать                  │ │ │ VPN: Windscribe │ │
│ │ - Альтернативы                │ │ └─────────────────┘ │
│ └───────────────────────────────┘ │                     │
├─────────────────────────────────────────────────────────┤
│ FAQ SECTION (accordion)                                 │
│ ▸ Вопрос 1                                              │
│ ▾ Вопрос 2                                              │
│   Ответ на вопрос 2...                                  │
├─────────────────────────────────────────────────────────┤
│ RELATED TOOLS                                           │
│ [Card] [Card] [Card] [Card]                             │
└─────────────────────────────────────────────────────────┘
```

### Мобильная версия (< 768px)

```
┌─────────────────────────┐
│ Breadcrumbs             │
├─────────────────────────┤
│ ┌─────────────────────┐ │
│ │   Cover Image       │ │
│ └─────────────────────┘ │
│ Title                   │
│ Description             │
│ ★ 4.7  |  от $5/мес    │
│ [Badges]                │
│ [CTA Button]            │
├─────────────────────────┤
│ ACCESS INFO (vertical)  │
├─────────────────────────┤
│ MDX Content             │
├─────────────────────────┤
│ FAQ                     │
├─────────────────────────┤
│ Related Tools           │
├─────────────────────────┤
│ [Fixed CTA Button]      │ ← position: fixed
└─────────────────────────┘
```

## Components and Interfaces

### Существующие компоненты (без изменений)

- `Wrapper` — контейнер с max-width
- `Rounded` — скруглённые углы
- `Button` — CTA кнопки (primary/secondary)
- `Breadcrumbs` — навигационная цепочка
- `RelatedTools` — похожие сервисы
- `AccessInfo` — блок доступности (вертикальный)

### Новые/модифицированные компоненты

#### 1. ToolHero (новый компонент)

```astro
---
interface Props {
  tool: ToolData;
}
---
```

Содержит:
- Изображение в Rounded
- Заголовок (h1)
- Краткое описание
- Рейтинг со звёздами
- Цена
- Бейджи доступности (компактные)
- CTA кнопки

#### 2. AccessBar (новый компонент)

Горизонтальный компактный блок с информацией о доступности:

```astro
---
interface Props {
  requiresVpn: boolean;
  acceptsRussianCards: boolean;
  supportsRussian: boolean;
  paymentMethods?: string[];
}
---
```

Использует семантические цвета IDS:
- `--ids__success-RGB` — положительные значения (Без VPN, Карты РФ)
- `--ids__warning-RGB` — предупреждения (Нужен VPN, Нет карт РФ)
- `--ids__info-RGB` — нейтральная информация (язык, способы оплаты)

#### 3. ToolSidebar (новый компонент)

Sticky sidebar с:
- CTA кнопка (primary)
- Цена
- Подсказки по оплате (если не принимает карты РФ)
- Подсказки по VPN (если требуется)

```astro
---
interface Props {
  tool: ToolData;
}
---
```

#### 4. FaqSection (модификация существующего)

Аккордеон с:
- Плавной анимацией раскрытия
- Типографикой IDS
- Генерацией FAQPage Schema

#### 5. MobileCta (новый компонент)

Фиксированная кнопка внизу экрана для мобильных:

```astro
---
interface Props {
  href: string;
  label?: string;
}
---
```

### Schema.org Generators

#### ProductSchema

```typescript
interface ProductSchema {
  "@context": "https://schema.org";
  "@type": "Product";
  name: string;
  description: string;
  image: string;
  aggregateRating?: {
    "@type": "AggregateRating";
    ratingValue: number;
    bestRating: 5;
    worstRating: 1;
  };
  offers: {
    "@type": "Offer";
    price: number | string;
    priceCurrency: "USD";
    availability: "https://schema.org/InStock";
  };
}
```

#### FAQPageSchema

```typescript
interface FAQPageSchema {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: Array<{
    "@type": "Question";
    name: string;
    acceptedAnswer: {
      "@type": "Answer";
      text: string;
    };
  }>;
}
```

## Data Models

### ToolData (существующая, без изменений)

```typescript
interface ToolData {
  slug: string;
  title: string;
  shortDescription: string;
  coverImage: string;
  tags: string[];
  priceModel: 'free' | 'freemium' | 'paid';
  priceFrom?: number;
  isNsfw: boolean;
  affiliateLink: string;
  rating?: number;
  acceptsRussianCards: boolean;
  requiresVpn: boolean;
  supportsRussian: boolean;
  paymentMethods?: string[];
  faq?: { question: string; answer: string }[];
  publishedAt: Date;
  updatedAt?: Date;
}
```

### Вспомогательные типы

```typescript
// Для генерации schema
interface SchemaGeneratorInput {
  tool: ToolData;
  siteUrl: string;
  breadcrumbs: BreadcrumbItem[];
}

interface BreadcrumbItem {
  label: string;
  href?: string;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Hero completeness
*For any* tool with valid data, the hero section SHALL contain: title, shortDescription, coverImage, CTA button, and price display. If rating exists, it SHALL be displayed.
**Validates: Requirements 1.1, 1.3, 1.4**

### Property 2: Restrictions display consistency
*For any* tool with requiresVpn: true, the page SHALL display VPN warning with warning color. *For any* tool with acceptsRussianCards: false, the page SHALL display alternative payment methods.
**Validates: Requirements 2.2, 2.3, 4.3**

### Property 3: FAQ conditional rendering
*For any* tool, if faq array is empty or undefined, the FAQ section SHALL NOT be rendered. If faq array has items, FAQPage Schema SHALL be generated.
**Validates: Requirements 5.1, 5.4**

### Property 4: Schema.org validity
*For any* tool page, the generated JSON-LD SHALL be valid JSON and contain required Schema.org fields (@context, @type, name for Product; itemListElement for BreadcrumbList).
**Validates: Requirements 7.1, 7.2, 7.4**

### Property 5: Related tools relevance
*For any* tool, the related tools section SHALL prioritize tools from the same collections, then tools with matching tags.
**Validates: Requirements 6.3**

## Error Handling

### Отсутствующие данные
- Нет coverImage → показать PlaceholderImage
- Нет rating → не показывать блок рейтинга
- Нет FAQ → не показывать секцию FAQ
- Нет paymentMethods → показать только статус карт РФ

### Ошибки загрузки
- Ошибка загрузки изображения → fallback на PlaceholderImage (уже реализовано)

### Валидация Schema
- Невалидный JSON-LD → логировать ошибку, не ломать страницу

## Testing Strategy

### Dual Testing Approach

Используем комбинацию unit-тестов и property-based тестов с библиотекой `fast-check`.

### Unit Tests

1. **Schema generators** — проверка корректности генерации JSON-LD
2. **Component rendering** — проверка условного рендеринга (FAQ, rating)
3. **CSS classes** — проверка применения семантических цветов

### Property-Based Tests

Каждый property-based тест должен быть помечен комментарием:
`// **Feature: tool-page-redesign, Property N: property_text**`

Минимум 100 итераций на тест.

#### PBT 1: Hero completeness
Генерируем случайные ToolData, проверяем что hero содержит все обязательные элементы.

#### PBT 2: Restrictions display
Генерируем ToolData с разными комбинациями requiresVpn/acceptsRussianCards, проверяем корректность отображения.

#### PBT 3: FAQ conditional
Генерируем ToolData с пустым и непустым FAQ, проверяем условный рендеринг.

#### PBT 4: Schema validity
Генерируем случайные ToolData, проверяем что JSON-LD валиден и содержит обязательные поля.

#### PBT 5: Related tools
Генерируем наборы инструментов, проверяем что related tools приоритизируют коллекции.

### Тестовый фреймворк

- Vitest (уже настроен в проекте)
- fast-check для property-based тестов

