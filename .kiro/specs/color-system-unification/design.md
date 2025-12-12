# Design Document: Color System Unification

## Overview

Унификация цветовой системы AI Catalog для устранения хаоса с хардкод цветами и создания единой семантической системы на базе IDS. 

Текущая проблема:
- colors.css определяет 8 базовых токенов
- COLOR_SYSTEM.md описывает 10 ролей с 6 уровнями opacity (которых нет в CSS!)
- Компоненты используют хардкод: `rgba(0, 180, 0, 0.15)`, `rgb(0, 140, 0)` и т.д.

Решение: расширить colors.css семантическими токенами и рефакторить все компоненты на их использование.

## Architecture

```
colors.css (единый источник)
    │
    ├── Base Tokens (RGB values)
    │   ├── --ids__text-RGB
    │   ├── --ids__link-RGB
    │   ├── --ids__hover-RGB
    │   ├── --ids__accent-RGB
    │   ├── --ids__success-RGB    ← NEW
    │   ├── --ids__warning-RGB    ← NEW
    │   ├── --ids__info-RGB       ← NEW
    │   ├── --ids__surface-RGB
    │   └── --ids__background-RGB
    │
    └── Usage Pattern
        └── rgba(var(--ids__token-RGB), opacity)
```

Компоненты используют токены через `rgba(var(--ids__token-RGB), opacity)` где opacity определяется по контексту:
- 1.0 — полный акцент (текст, иконки)
- 0.6 — вторичный текст
- 0.4 — третичный текст, placeholder
- 0.2 — бордеры, разделители
- 0.1 — фоны, подложки

## Components and Interfaces

### Color Token Structure

```css
:root {
  /* === BASE COLORS === */
  --ids__text-RGB:        5, 5, 5;
  --ids__link-RGB:        0, 100, 240;
  --ids__hover-RGB:       0, 200, 0;
  --ids__accent-RGB:      253, 47, 75;
  
  /* === SEMANTIC STATUS COLORS === */
  --ids__success-RGB:     34, 160, 80;    /* Позитив: бесплатно, доступно, без VPN */
  --ids__warning-RGB:     200, 140, 0;    /* Ограничения: VPN, платно, крипто */
  --ids__info-RGB:        0, 120, 200;    /* Нейтральная инфо: язык, категория */
  
  /* === SURFACES === */
  --ids__surface-RGB:     238, 240, 242;
  --ids__background-RGB:  255, 255, 255;
  
  /* === LEGACY (deprecated) === */
  --ids__code-RGB:        115, 120, 125;
  --ids__mark-RGB:        255, 225, 0;
}
```

### Semantic Role Mapping

| Role | Token | Use Cases |
|------|-------|-----------|
| **Text** | `--ids__text-RGB` | Основной текст, заголовки, иконки |
| **Link** | `--ids__link-RGB` | Ссылки, интерактивные элементы |
| **Hover** | `--ids__hover-RGB` | Состояние наведения |
| **Accent** | `--ids__accent-RGB` | Акценты, featured элементы |
| **Success** | `--ids__success-RGB` | Позитивные статусы: free, no-vpn, available |
| **Warning** | `--ids__warning-RGB` | Ограничения: vpn-required, paid, crypto |
| **Info** | `--ids__info-RGB` | Нейтральная информация: language, category, payment methods |
| **Surface** | `--ids__surface-RGB` | Фоны карточек, контейнеров |
| **Background** | `--ids__background-RGB` | Основной фон страницы |

### Badge Color Mapping

```
AccessBadges:
  ├── no-vpn      → success (позитив)
  ├── vpn-required → warning (ограничение)
  └── russian     → info (нейтральная инфо)

PaymentBadges:
  ├── free        → success (позитив)
  ├── russian-cards → success (позитив - доступно)
  ├── crypto      → warning (альтернатива, требует усилий)
  └── sbp         → info (способ оплаты)
```

## Data Models

### Token Usage Pattern

```css
/* Полный акцент - текст, иконки */
color: rgb(var(--ids__success-RGB));

/* Фон бейджа - 15% opacity */
background: rgba(var(--ids__success-RGB), 0.15);

/* Бордер - 30% opacity */
border: 1px solid rgba(var(--ids__success-RGB), 0.3);

/* Hover фон - 10% opacity */
background: rgba(var(--ids__hover-RGB), 0.1);
```

### Component Refactoring Map

| Component | Current | Target |
|-----------|---------|--------|
| AccessBadges | `rgba(0, 180, 0, 0.15)` | `rgba(var(--ids__success-RGB), 0.15)` |
| AccessBadges | `rgb(0, 140, 0)` | `rgb(var(--ids__success-RGB))` |
| AccessBadges | `rgba(255, 180, 0, 0.15)` | `rgba(var(--ids__warning-RGB), 0.15)` |
| AccessBadges | `rgb(180, 120, 0)` | `rgb(var(--ids__warning-RGB))` |
| AccessBadges | `rgba(0, 100, 200, 0.15)` | `rgba(var(--ids__info-RGB), 0.15)` |
| PaymentBadges | Same pattern | Same refactoring |
| Button | Already uses IDS tokens | ✓ OK |
| GlobalHeader | Already uses IDS tokens | ✓ OK |
| GlobalFooter | Already uses IDS tokens | ✓ OK |
| ToolCard | Already uses IDS tokens | ✓ OK |

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: All semantic tokens defined in colors.css

*For any* expected semantic color role (text, link, hover, accent, success, warning, info, surface, background), the colors.css file SHALL contain a corresponding `--ids__<role>-RGB` custom property with a valid RGB value format.

**Validates: Requirements 1.1, 2.1**

### Property 2: No hardcoded color values in components

*For any* Astro component file in src/components, all color-related CSS properties (color, background, background-color, border, border-color) SHALL use only `var(--ids__*-RGB)` tokens or inherit/transparent/currentColor keywords, with no hardcoded rgb(), rgba(), hex, or named color values.

**Validates: Requirements 1.2, 1.4, 5.3**

### Property 3: Badges use correct semantic tokens

*For any* badge component (AccessBadges, PaymentBadges), positive status badges (free, no-vpn, russian-cards) SHALL use `--ids__success-RGB`, limitation badges (vpn-required, crypto) SHALL use `--ids__warning-RGB`, and neutral info badges (russian, sbp) SHALL use `--ids__info-RGB`.

**Validates: Requirements 2.2, 2.3, 2.4, 3.1, 3.2**

### Property 4: Hover states use hover token

*For any* CSS rule with `:hover` pseudo-class that changes color, the hover state SHALL reference `--ids__hover-RGB` or `--ids__link-RGB` token.

**Validates: Requirements 2.5, 3.3**

### Property 5: Documentation matches implementation

*For any* color token defined in colors.css, the COLOR_SYSTEM.md documentation SHALL contain a corresponding entry describing that token's purpose and usage.

**Validates: Requirements 6.1**

## Error Handling

- **Missing token**: If a component references an undefined token, CSS will fall back to initial value. Linting should catch this.
- **Invalid RGB format**: CSS parser will ignore invalid values. Property tests will catch malformed tokens.
- **Dark mode**: Current system doesn't support dark mode. Future enhancement could add `@media (prefers-color-scheme: dark)` overrides.

## Testing Strategy

### Property-Based Testing

Library: **fast-check** (already used in project based on existing test files)

Each correctness property will be implemented as a property-based test:

1. **Token Definition Test**: Parse colors.css, generate list of expected tokens, verify all are present with valid RGB format
2. **No Hardcoded Colors Test**: Scan all .astro files in components/, extract style blocks, verify no hardcoded color patterns
3. **Badge Semantic Tokens Test**: Parse badge component files, map badge classes to expected tokens, verify correct mapping
4. **Hover Token Test**: Parse all CSS, find :hover rules with color changes, verify they use hover/link tokens
5. **Documentation Sync Test**: Parse colors.css tokens, parse COLOR_SYSTEM.md, verify all tokens are documented

### Unit Tests

- Verify specific badge renders with correct CSS class
- Verify Button component uses correct tokens for each variant
- Verify color token values are valid RGB triplets

### Test Annotations

Each property-based test MUST include:
```typescript
/**
 * Feature: color-system-unification, Property N: <property_text>
 * Validates: Requirements X.Y
 */
```
