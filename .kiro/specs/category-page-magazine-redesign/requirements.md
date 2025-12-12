# Requirements Document

## Introduction

Редизайн страницы категорий (коллекций) AI-каталога в стиле модного журнала. Цель — создать визуально впечатляющую, чистую верстку с использованием IDS компонентов, которая передает премиальный вайб и выделяет контент как в лучших дизайн-изданиях.

## Glossary

- **Category Page**: Страница коллекции инструментов (например, /category/image-generators)
- **IDS**: Internal Design System — дизайн-система проекта с CSS-переменными и компонентами
- **Magazine Layout**: Верстка в стиле модного журнала с акцентом на типографику, whitespace и визуальную иерархию
- **Hero Section**: Главный блок страницы с заголовком и описанием категории
- **Tool Grid**: Сетка карточек инструментов
- **Editorial Content**: Редакционный контент из MDX-файла коллекции

## Requirements

### Requirement 1

**User Story:** As a user, I want to see a visually striking hero section when I open a category page, so that I immediately understand what the category is about and feel the premium quality of the catalog.

#### Acceptance Criteria

1. WHEN a user opens a category page THEN the system SHALL display a full-width hero section with the category title in large editorial typography
2. WHEN the hero section renders THEN the system SHALL show the category description with appropriate line-height and letter-spacing for readability
3. WHEN the hero section renders THEN the system SHALL display a tool count badge styled as a subtle accent element
4. WHEN the hero section renders THEN the system SHALL use generous whitespace (padding/margin) to create breathing room around content

### Requirement 2

**User Story:** As a user, I want to browse tools in an elegant grid layout, so that I can easily scan and compare available services.

#### Acceptance Criteria

1. WHEN tools are displayed THEN the system SHALL render them in a responsive grid with consistent spacing
2. WHEN the grid renders THEN the system SHALL use the existing ToolCard component with proper aspect ratios
3. WHEN the grid has more than 6 tools THEN the system SHALL maintain visual rhythm without overwhelming the user
4. WHEN the page renders on mobile THEN the system SHALL adapt the grid to a single or two-column layout

### Requirement 3

**User Story:** As a user, I want to see a comparison table for tools in the category, so that I can quickly compare key features.

#### Acceptance Criteria

1. WHEN a category has more than one tool THEN the system SHALL display the ComparisonTable component
2. WHEN the comparison table renders THEN the system SHALL use clean typography consistent with magazine style
3. WHEN the comparison table renders THEN the system SHALL have adequate spacing from surrounding content

### Requirement 4

**User Story:** As a user, I want to read editorial content about the category, so that I can learn more about the tools and make informed decisions.

#### Acceptance Criteria

1. WHEN editorial content exists THEN the system SHALL render it in a constrained text-width column for optimal readability
2. WHEN editorial content renders THEN the system SHALL use IDS typography styles (headings, paragraphs, lists, tables)
3. WHEN editorial content renders THEN the system SHALL have clear visual separation from the tool grid

### Requirement 5

**User Story:** As a user, I want to navigate to other categories easily, so that I can explore the full catalog.

#### Acceptance Criteria

1. WHEN the page renders THEN the system SHALL display other categories in a clean horizontal or grid layout
2. WHEN category links render THEN the system SHALL use the CategoryCard component with minimal styling
3. WHEN hovering over category links THEN the system SHALL provide subtle visual feedback

### Requirement 6

**User Story:** As a user, I want the page to have proper SEO and structured data, so that search engines can index the content correctly.

#### Acceptance Criteria

1. WHEN the page renders THEN the system SHALL include Schema.org CollectionPage structured data
2. WHEN the page renders THEN the system SHALL have proper breadcrumb navigation
3. WHEN the page renders THEN the system SHALL use semantic HTML elements (header, main, section, aside)

### Requirement 7

**User Story:** As a developer, I want the page to use IDS design tokens consistently, so that the design system remains coherent.

#### Acceptance Criteria

1. WHEN styling elements THEN the system SHALL use CSS variables from the IDS color system (--ids__text-RGB, --ids__surface-RGB, etc.)
2. WHEN setting spacing THEN the system SHALL use the --ids__density variable for consistent rhythm
3. WHEN setting border-radius THEN the system SHALL use the --ids__radius variable
4. WHEN styling typography THEN the system SHALL follow IDS heading and paragraph styles from ids.css
