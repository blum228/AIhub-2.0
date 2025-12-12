# Design Document: Magazine Typography

## Overview

Расширение типографической системы IDS для создания журнального контента в стиле Бюро Горбунова. Основная работа — создание новых компонентов Dialog и Remark, а также расширение существующего Aside типами.

Существующие элементы IDS (используем как есть):
- `aside` — выноски на сером фоне
- `blockquote` — цитаты
- `p.loud` — лид-абзац (2em)
- `p.huge` — крупный акцент (6em с обводкой)

Новые компоненты:
- `Dialog` — диалоги с репликами
- `Remark` — ремарки автора в скобках
- Расширение `Aside` типами (warning, tip)

## Architecture

### Структура компонентов

```
src/components/
├── Aside.astro          # Существующий, расширить типами
├── Dialog.astro         # НОВЫЙ
├── DialogLine.astro     # НОВЫЙ (реплика диалога)
└── Remark.astro         # НОВЫЙ
```

### Пример использования в MDX

```mdx
import Aside from '../components/Aside.astro';
import Dialog from '../components/Dialog.astro';
import DialogLine from '../components/DialogLine.astro';
import Remark from '../components/Remark.astro';

## Глава 2. Как не бояться

<p class="loud">
Можно сказать: «прокрастинация». Я избегаю этого слова по одной простой причине.
</p>

<Aside>
А вопрос «чего я боюсь» — это, если угодно, лайфхак десятикратной силы, босс среди лайфхаков.
</Aside>

<Dialog>
  <DialogLine>Давай договоримся, что у меня есть право на ошибку?</DialogLine>
  <DialogLine>Ой, да без проблем. Ошибайся сколько хочешь! Ты, главное, сделай всё как договорились, ладно?</DialogLine>
</Dialog>

<Remark>Не получилось договориться.</Remark>

<p class="huge">Я передумал.</p>

<Aside type="warning">
Внимание: это важное предупреждение.
</Aside>
```

## Components and Interfaces

### 1. Dialog (новый компонент)

Контейнер для диалога. Добавляет отступы и группирует реплики.

```astro
---
interface Props {
  class?: string;
}
---
```

HTML-структура:
```html
<div class="dialog">
  <slot />
</div>
```

### 2. DialogLine (новый компонент)

Отдельная реплика в диалоге. Добавляет тире в начале.

```astro
---
interface Props {
  class?: string;
}
---
```

HTML-структура:
```html
<p class="dialog__line">
  — <slot />
</p>
```

### 3. Remark (новый компонент)

Ремарка автора в скобках курсивом.

```astro
---
interface Props {
  class?: string;
}
---
```

HTML-структура:
```html
<p class="remark">
  (<em><slot /></em>)
</p>
```

### 4. Aside (расширение существующего)

Добавить поддержку типов для разных цветов фона.

```astro
---
interface Props {
  type?: 'default' | 'warning' | 'tip';
  class?: string;
}
---
```

HTML-структура:
```html
<aside class={`aside aside--${type}`}>
  <slot />
</aside>
```

## Data Models

Компоненты не требуют сложных моделей данных — они работают со слотами (children).

```typescript
// Типы для Aside
type AsideType = 'default' | 'warning' | 'tip';

// Цветовое соответствие
const asideColors: Record<AsideType, string> = {
  default: '--ids__surface-RGB',
  warning: '--ids__warning-RGB',
  tip: '--ids__success-RGB'
};
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Dialog lines have dash prefix
*For any* DialogLine component with non-empty content, the rendered output SHALL contain an em-dash (—) character before the content.
**Validates: Requirements 1.1**

### Property 2: Remark adds parentheses
*For any* Remark component with text content, the rendered output SHALL wrap the content in parentheses.
**Validates: Requirements 2.1, 2.3**

### Property 3: Aside type applies correct class
*For any* Aside component with a type prop, the rendered element SHALL have a class corresponding to that type (aside--warning, aside--tip, or no modifier for default).
**Validates: Requirements 3.1, 3.2, 3.3**

## Error Handling

### Пустой контент
- Dialog без DialogLine — рендерит пустой контейнер
- DialogLine без текста — рендерит только тире
- Remark без текста — рендерит пустые скобки "()"
- Aside без контента — рендерит пустой блок

### Невалидный тип Aside
- Неизвестный тип — использовать default

## Testing Strategy

### Dual Testing Approach

Используем Vitest с fast-check для property-based тестов.

### Unit Tests

1. **DialogLine rendering** — проверка наличия тире
2. **Remark rendering** — проверка скобок и курсива
3. **Aside types** — проверка классов для разных типов

### Property-Based Tests

Каждый property-based тест помечается комментарием:
`// **Feature: magazine-typography, Property N: property_text**`

Минимум 100 итераций на тест.

#### PBT 1: Dialog lines have dash prefix
Генерируем случайные строки, проверяем что DialogLine добавляет тире.

#### PBT 2: Remark adds parentheses
Генерируем случайные строки, проверяем что Remark оборачивает в скобки.

#### PBT 3: Aside type applies correct class
Генерируем случайные типы, проверяем соответствие классов.

### Тестовый фреймворк

- Vitest (уже настроен)
- fast-check для property-based тестов
