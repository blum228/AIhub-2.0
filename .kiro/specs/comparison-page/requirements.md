# Requirements Document

## Introduction

Страница интерактивного сравнения инструментов. Позволяет пользователям выбрать 2-4 сервиса и сравнить их характеристики бок о бок. Важная функция для принятия решения о выборе сервиса.

**Обязательное условие:** Весь дизайн ДОЛЖЕН использовать IDS (Intuition Design System). Референс стиля: `/src/pages/ids-demo.astro`.

## Glossary

- **Comparison Table**: Таблица сравнения с характеристиками инструментов
- **Tool Selector**: Компонент выбора инструментов для сравнения
- **Shareable URL**: URL с параметрами выбранных инструментов

## Requirements

### Requirement 1: Выбор инструментов

**User Story:** Как пользователь, я хочу выбрать инструменты для сравнения.

#### Acceptance Criteria

1. WHEN a user visits /compare THEN the Platform SHALL display tool selector with search and dropdown
2. WHEN tools are selected THEN the Platform SHALL allow selecting 2-4 tools maximum
3. WHEN a tool is selected THEN the Platform SHALL display its mini-card with remove button

### Requirement 2: Таблица сравнения

**User Story:** Как пользователь, я хочу видеть характеристики инструментов бок о бок.

#### Acceptance Criteria

1. WHEN tools are selected THEN the Platform SHALL display comparison table using IDS table styles
2. THE comparison table SHALL include rows: Цена, Бесплатный план, Карты РФ, Крипто, Нужен VPN, Русский язык, Рейтинг, Тип
3. WHEN a cell has positive value THEN the Platform SHALL highlight it with green
4. WHEN a cell has negative value THEN the Platform SHALL highlight it with red

### Requirement 3: Шаринг

**User Story:** Как пользователь, я хочу поделиться сравнением с другими.

#### Acceptance Criteria

1. WHEN tools are selected THEN the Platform SHALL update URL with tool slugs as parameters
2. WHEN a user visits comparison URL with parameters THEN the Platform SHALL pre-select specified tools
3. WHEN comparison is displayed THEN the Platform SHALL show "Скопировать ссылку" button

