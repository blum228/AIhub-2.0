# Design Document: UX/Design Audit

## Overview

Системный рефакторинг сайта AI Каталог СНГ для приведения к философии и компонентам Intuition Design System (IDS). Основная цель — устранить кастомные решения, перегруз UX и неконсистентность дизайна, заменив их стандартными компонентами и паттернами IDS.

### Философия IDS

IDS основана на нескольких ключевых принципах:

1. **Этажная структура**: Страница состоит из вертикальных "этажей" (Wrapper), без модульных сеток
2. **Функциональные цвета**: Именование по назначению (text, link, hover, surface), не по оттенку
3. **Density-based spacing**: Все отступы рассчитываются через `--ids__density`
4. **Минимализм**: Никаких избыточных анимаций, градиентов, теней
5. **Нарративность**: Дизайн служит контенту, не отвлекает от него

## Architecture

### Текущая проблема

```
┌─────────────────────────────────────────────────────────────┐
│ ТЕКУЩЕЕ СОСТОЯНИЕ                                           │
├─────────────────────────────────────────────────────────────┤
│ • Кастомные CSS-стили в каждом компоненте                   │
│ • CSS Grid вместо Sequence                                  │
│ • Sticky header с surface-фоном                             │
│ • Градиенты, transform-анимации, clamp()                    │
│ • Двухколоночные layouts                                    │
│ • Кастомные badges, buttons, cards                          │
└─────────────────────────────────────────────────────────────┘
```

### Целевая архитектура

```
┌─────────────────────────────────────────────────────────────┐
│ ЦЕЛЕВОЕ СОСТОЯНИЕ (IDS)                                     │
├─────────────────────────────────────────────────────────────┤
│ • Только компоненты IDS: Wrapper, Space, TextWidth,         │
│   Sequence, Rounded, Aside, Gallery, Sleepy                 │
│ • Вертикальная "этажная" структура                          │
│ • Статичный header с background-фоном                       │
│ • Плоские цвета, только color-transitions                   │
│ • Одноколоночные layouts с TextWidth                        │
│ • Стандартные aside, code, mark для выделений               │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### Компоненты для рефакторинга

| Компонент | Текущее состояние | Целевое состояние |
|-----------|-------------------|-------------------|
| HeroSection | Градиент, clamp(), кастомная кнопка | Wrapper + TextWidth + h1.S + .loud + стандартная ссылка |
| GlobalHeader | Sticky, surface-фон, кастомный логотип | Статичный, background-фон, стандартный текст |
| ToolCard | Кастомный grid, hover-scale, radius="1em" | Sequence, color-only hover, var(--ids__radius) |
| CategoryCard | Flex с кастомными стилями | Aside с стандартными стилями IDS |
| ToolPage | Двухколоночный grid, множество badges | Вертикальный layout, aside для meta |
| BlogCard | aspect-ratio, hover-scale | Простая структура, color-only hover |
| GlobalFooter | CSS Grid, border-top | Вертикальный layout, Space для разделения |

### Паттерны замены

```astro
<!-- БЫЛО: Кастомная кнопка -->
<a href="/catalog" class="hero__cta">Открыть каталог →</a>

<!-- СТАЛО: Стандартная ссылка IDS -->
<a href="/catalog">Открыть каталог →</a>
```

```astro
<!-- БЫЛО: Кастомный badge -->
<span class="tool-page__badge tool-page__badge--free">Бесплатно</span>

<!-- СТАЛО: Стандартный code IDS -->
<code>Бесплатно</code>
```

```astro
<!-- БЫЛО: CSS Grid для карточек -->
<div class="tool-grid">
  {tools.map(tool => <ToolCard {...tool} />)}
</div>

<!-- СТАЛО: Sequence IDS -->
<Sequence size="L" gap="M">
  {tools.map(tool => (
    <SequenceItem>
      <ToolCard {...tool} />
    </SequenceItem>
  ))}
</Sequence>
```

## Data Models

Изменения в данных не требуются. Рефакторинг затрагивает только presentation layer.

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: CSS Variables Consistency

*For any* component with styling, all colors, border-radius, and spacing values should use IDS CSS variables (`--ids__*-RGB`, `--ids__radius`, `--ids__density`) instead of hardcoded values.

**Validates: Requirements 5.1, 5.2, 5.3**

### Property 2: No Transform Animations on Hover

*For any* element with hover state, the hover styles should only change color properties without using transform, scale, or translateY effects.

**Validates: Requirements 4.4, 8.1, 8.2, 8.4**

### Property 3: No Gradients in Styles

*For any* component, the CSS should not contain `linear-gradient` or `radial-gradient` functions, using flat IDS colors instead.

**Validates: Requirements 8.3**

### Property 4: Font Size Consistency

*For any* text element, font-size should use em units or standard IDS classes (.loud, .huge, h1.S) without clamp() functions.

**Validates: Requirements 11.1, 11.2, 11.4**

### Property 5: Rounded Components Use IDS Radius

*For any* Rounded component, the radius prop should use `var(--ids__radius)` or be omitted to use the default, not hardcoded values like "1em".

**Validates: Requirements 4.1, 5.2**

### Property 6: TextWidth for Content Restriction

*For any* content block that needs width restriction, it should use the TextWidth component instead of custom max-width CSS.

**Validates: Requirements 7.4**

## Error Handling

Ошибки в контексте этого аудита — это нарушения консистентности IDS:

1. **CSS Lint Errors**: Использование хардкод-значений вместо переменных
2. **Component Misuse**: Использование кастомных компонентов вместо IDS
3. **Style Violations**: Градиенты, transform-анимации, sticky positioning

Все ошибки должны быть выявлены через property-based тесты и исправлены в процессе рефакторинга.

## Testing Strategy

### Dual Testing Approach

#### Unit Tests
- Проверка конкретных компонентов на соответствие IDS
- Snapshot-тесты для визуальной регрессии
- Проверка отсутствия кастомных стилей в конкретных файлах

#### Property-Based Tests

Используем **fast-check** для TypeScript/JavaScript property-based testing.

Каждый property-based тест должен:
1. Генерировать случайные CSS-файлы или компоненты
2. Проверять соответствие правилам IDS
3. Запускаться минимум 100 итераций

Формат аннотации тестов:
```typescript
// **Feature: ux-design-audit, Property 1: CSS Variables Consistency**
```

### Тестовые сценарии

| Property | Тест | Генератор |
|----------|------|-----------|
| 1 | CSS Variables | Парсинг CSS-файлов, поиск хардкод-значений |
| 2 | No Transform | Парсинг :hover правил, проверка отсутствия transform |
| 3 | No Gradients | Поиск gradient в CSS |
| 4 | Font Size | Проверка font-size значений на em/rem |
| 5 | Rounded Radius | Проверка props компонента Rounded |
| 6 | TextWidth Usage | Проверка использования TextWidth vs max-width |
