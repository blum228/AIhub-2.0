# Design Document: Catalog Layout Fix

## Overview

Исправление верстки AI каталога для полного соответствия дизайн-системе IDS. Работа включает рефакторинг существующих компонентов и страниц для использования правильных IDS-паттернов вместо кастомных CSS-решений.

Ключевые изменения:
- Замена CSS margin/padding на компоненты Space
- Использование Sequence вместо CSS Grid для карточек
- Применение TextWidth для ограничения ширины текста
- Унификация стилей badges, buttons, cards
- Исправление типографики по стандартам IDS

## Architecture

### Текущая структура (проблемы)

```
CatalogLayout.astro
├── header (кастомные стили)
├── Wrapper
│   ├── Space size="M"
│   ├── slot (контент страницы)
│   └── Space size="L"
└── footer (кастомные стили)

catalog/index.astro
├── section.hero (кастомные стили, нет TextWidth)
├── section.categories-section (CSS Grid вместо Sequence)
├── TagFilter (ок)
├── section.tools-section (использует ToolGrid/Sequence)
└── section.tools-section--featured (кастомные стили)

tool/[slug].astro
├── Breadcrumbs
├── article.tool-page
│   ├── header (CSS Grid, кастомные стили)
│   ├── section.tool-page__content (нет TextWidth)
│   ├── AccessInfo, PaymentGuide, TelegramGuide
│   ├── FAQ (кастомные стили)
│   └── RelatedTools
```

### Целевая структура (исправленная)

```
CatalogLayout.astro
├── header (IDS padding через density)
├── Wrapper
│   ├── Space size="M"
│   ├── slot
│   └── Space size="L"
└── footer (IDS стили)

catalog/index.astro
├── TextWidth
│   ├── Space size="XL"
│   ├── h1 (IDS стили, без кастомного font-size)
│   ├── p.loud (IDS класс для subtitle)
│   └── SearchWidget
├── Space size="L"
├── h2 (IDS стили)
├── Sequence size="L" gap="M" (категории)
├── Space size="L"
├── TagFilter
├── Space size="M"
├── h2 (IDS стили)
├── Sequence size="M" gap="M" (инструменты через ToolGrid)
├── Space size="L"
└── Featured section (если есть)

tool/[slug].astro
├── Breadcrumbs
├── Space size="S"
├── article
│   ├── header (CSS Grid, исправленные стили)
│   ├── Space size="L"
│   ├── TextWidth
│   │   └── Content (prose)
│   ├── Space size="M"
│   ├── AccessInfo, PaymentGuide, TelegramGuide
│   ├── Space size="M"
│   ├── FAQ (IDS aside стили)
│   └── RelatedTools
```

## Components and Interfaces

### Изменяемые компоненты

#### 1. CatalogLayout.astro
- Убрать кастомные padding в header/footer
- Использовать IDS density-based padding
- Исправить стили навигации

#### 2. catalog/index.astro
- Обернуть hero в TextWidth
- Заменить categories-grid на Sequence
- Убрать кастомные font-size для h1, h2
- Использовать Space между секциями
- Убрать section-title кастомные стили

#### 3. tool/[slug].astro
- Обернуть content в TextWidth
- Исправить header grid
- Унифицировать стили badges
- Использовать Space между секциями
- Исправить FAQ стили

#### 4. CategoryCard.astro
- Убедиться в использовании Rounded
- Исправить внутренние отступы

#### 5. ToolCard.astro
- Проверить использование Rounded
- Унифицировать badge стили

#### 6. TagFilter.astro
- Исправить spacing
- Унифицировать button стили

#### 7. FooterNav.astro
- Исправить grid layout
- Использовать IDS стили для ссылок

### Новые CSS-классы (если нужны)

Не требуются — используем существующие IDS классы:
- `.loud` для увеличенного текста
- `.ids__space`, `.ids__wrapper`, `.ids__text-width`, `.ids__sequence`

## Data Models

Изменения в data models не требуются. Работа касается только presentation layer.

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Analysis

После анализа всех acceptance criteria, все требования относятся к:
- Структуре кода (использование компонентов)
- CSS стилям (визуальное оформление)
- DOM структуре (порядок элементов)

Эти аспекты не являются функциональным поведением, которое можно протестировать property-based тестами. Они относятся к:
- Code review (правильность использования компонентов)
- Visual regression testing (корректность стилей)
- Linting rules (структура кода)

**Вывод:** Для данной задачи (рефакторинг верстки) property-based тесты не применимы. Качество будет обеспечиваться через:
1. Code review на соответствие IDS паттернам
2. Визуальную проверку в браузере
3. Сравнение с референсом ids-demo.astro

## Error Handling

Ошибки верстки не генерируют runtime exceptions. Потенциальные проблемы:
- Отсутствующие CSS переменные → fallback значения в CSS
- Неправильные размеры компонентов → визуальные артефакты

Митигация: тщательное тестирование в браузере после каждого изменения.

## Testing Strategy

### Подход к тестированию

Поскольку задача касается визуальной верстки, а не функциональной логики:

1. **Manual Visual Testing**
   - Проверка каждой страницы в браузере
   - Сравнение с референсом ids-demo.astro
   - Тестирование responsive поведения (desktop/mobile)

2. **Code Review Checklist**
   - [ ] Используются Space компоненты вместо CSS margin
   - [ ] Используется TextWidth для текстового контента
   - [ ] Используется Sequence для сеток карточек
   - [ ] Нет кастомных font-size для h1/h2/h3
   - [ ] Используются IDS CSS переменные

3. **Browser Testing**
   - Chrome (desktop)
   - Chrome (mobile emulation)
   - Firefox (desktop)

### Property-Based Testing

Не применимо для данной задачи — все требования относятся к визуальному оформлению и структуре кода, а не к функциональному поведению.

### Unit Testing

Не применимо — компоненты Astro являются presentation-only и не содержат тестируемой логики.
