# Requirements Document

## Introduction

Унификация цветовой системы AI Catalog на базе IDS Design System. Текущее состояние — хаос: документация описывает 10 цветовых ролей с 6 уровнями opacity, но в CSS определены только 8 базовых токенов. Компоненты используют хардкод цветов (`rgba(0, 180, 0, 0.15)`, `rgb(0, 140, 0)` и т.д.), что приводит к визуальной несогласованности и сложности поддержки.

Цель — создать единую семантическую систему цветов, где каждый компонент использует токены из colors.css в зависимости от своей роли (статус, действие, информация).

## Glossary

- **IDS**: Internal Design System — внутренняя дизайн-система проекта
- **Color Token**: CSS-переменная, хранящая значение цвета (например, `--ids__success-RGB`)
- **Semantic Color**: Цвет, названный по его роли/назначению, а не по визуальному значению
- **Color Role**: Функциональное назначение цвета (primary, success, warning и т.д.)
- **Opacity Variant**: Вариант цвета с определённой прозрачностью для создания иерархии
- **Badge**: Компонент-метка для отображения статуса или категории
- **Surface**: Фоновая поверхность для карточек и контейнеров

## Requirements

### Requirement 1

**User Story:** As a developer, I want a single source of truth for all colors, so that I can maintain visual consistency across the entire application.

#### Acceptance Criteria

1. WHEN colors.css is loaded THEN the system SHALL define all semantic color tokens as CSS custom properties with RGB values
2. WHEN a component needs a color THEN the component SHALL reference only tokens from colors.css using `rgba(var(--ids__token-RGB), opacity)` syntax
3. WHEN a new color is needed THEN the developer SHALL add it to colors.css rather than hardcoding in component styles
4. IF a component contains hardcoded color values THEN the system SHALL be refactored to use semantic tokens instead

### Requirement 2

**User Story:** As a designer, I want colors organized by semantic role, so that the visual language communicates meaning consistently.

#### Acceptance Criteria

1. WHEN defining color tokens THEN the system SHALL organize them into semantic roles: text, link, hover, accent, success, warning, info, surface, background
2. WHEN a badge indicates positive status (free, no-vpn, available) THEN the badge SHALL use the success color role
3. WHEN a badge indicates caution or limitation (vpn-required, paid) THEN the badge SHALL use the warning color role
4. WHEN a badge indicates neutral information (language, category) THEN the badge SHALL use the info color role
5. WHEN an element is interactive (links, buttons) THEN the element SHALL use the link or accent color role

### Requirement 3

**User Story:** As a user, I want consistent visual feedback, so that I can understand the meaning of different UI elements intuitively.

#### Acceptance Criteria

1. WHEN displaying access status badges THEN the system SHALL use consistent colors: success for positive, warning for limitations
2. WHEN displaying payment badges THEN the system SHALL use consistent colors: success for free/available, warning for crypto, info for payment methods
3. WHEN hovering over interactive elements THEN the system SHALL provide consistent color transitions using the hover token
4. WHEN text has different importance levels THEN the system SHALL use opacity variants of the text color (100%, 60%, 40%)

### Requirement 4

**User Story:** As a developer, I want to easily create visual hierarchy, so that I can guide user attention effectively.

#### Acceptance Criteria

1. WHEN colors.css defines a color role THEN the system SHALL provide opacity variants at 100%, 60%, 40%, 20%, 10% levels
2. WHEN a component needs a subtle background THEN the component SHALL use the 10% or 20% opacity variant
3. WHEN a component needs a border THEN the component SHALL use the 20% or 40% opacity variant
4. WHEN a component needs full emphasis THEN the component SHALL use the 100% opacity variant

### Requirement 5

**User Story:** As a maintainer, I want to change the color palette easily, so that I can update the visual style without touching component code.

#### Acceptance Criteria

1. WHEN the design team changes a color value THEN the maintainer SHALL update only the RGB value in colors.css
2. WHEN colors.css is updated THEN all components using that token SHALL automatically reflect the change
3. WHEN auditing color usage THEN the system SHALL have no hardcoded color values in component styles (except for external/third-party requirements)

### Requirement 6

**User Story:** As a developer, I want clear documentation of the color system, so that I know which token to use for each use case.

#### Acceptance Criteria

1. WHEN colors.css is updated THEN the COLOR_SYSTEM.md documentation SHALL be updated to match the actual token definitions
2. WHEN a developer needs to choose a color THEN the documentation SHALL provide clear guidance on which role to use for each component type
3. WHEN adding a new component THEN the documentation SHALL include examples of correct token usage for badges, buttons, links, and text
