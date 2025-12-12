# Requirements Document

## Introduction

Исправление верстки AI каталога для соответствия дизайн-системе IDS (Intuition Design System). Текущая верстка имеет проблемы с отступами, типографикой, использованием компонентов и общей консистентностью. Цель — привести все страницы каталога к качественному уровню, как в референсе ids-demo.astro.

## Glossary

- **IDS**: Intuition Design System — дизайн-система для вёрстки, основанная на компонентах Wrapper, Space, TextWidth, Sequence
- **Catalog**: AI каталог — раздел сайта с карточками AI-сервисов
- **Tool Page**: Страница отдельного инструмента/сервиса
- **Category Page**: Страница категории с фильтрованным списком инструментов
- **Density**: CSS-переменная `--ids__density` для расчёта отступов (1.3)
- **Wrapper**: Компонент-обёртка для контроля ширины контента
- **Space**: Компонент вертикальных отступов (S/M/L/XL)
- **Sequence**: Flex-сетка для равномерного распределения элементов
- **TextWidth**: Обёртка для текстовой колонки (85% от Wrapper)

## Requirements

### Requirement 1

**User Story:** Как пользователь, я хочу видеть консистентные отступы на всех страницах каталога, чтобы интерфейс выглядел профессионально и аккуратно.

#### Acceptance Criteria

1. WHEN the Catalog_Layout renders content THEN the System SHALL use Space components with appropriate sizes (S/M/L/XL) instead of CSS margin/padding for major vertical spacing
2. WHEN a section starts THEN the System SHALL apply Space size="L" or size="XL" before section headings
3. WHEN content blocks follow each other THEN the System SHALL apply Space size="M" between them
4. WHEN the page ends THEN the System SHALL apply Space size="L" before the footer

### Requirement 2

**User Story:** Как пользователь, я хочу видеть правильную типографику на страницах каталога, чтобы текст был читаемым и соответствовал дизайн-системе.

#### Acceptance Criteria

1. WHEN headings render THEN the System SHALL use IDS heading styles (h1: 3.6em, h2: 2.4em, h3: 1.5em) without custom font-size overrides
2. WHEN paragraphs render THEN the System SHALL use IDS paragraph styles with margin-bottom based on density variable
3. WHEN the hero section renders THEN the System SHALL use h1 with class="S" for smaller hero titles or standard h1 for main titles
4. WHEN section titles render THEN the System SHALL use h2 or h3 tags without custom styling that conflicts with IDS

### Requirement 3

**User Story:** Как пользователь, я хочу видеть правильно организованную сетку карточек, чтобы контент был удобно структурирован.

#### Acceptance Criteria

1. WHEN tool cards display THEN the System SHALL use Sequence component with size="M" (4 columns) and gap="M"
2. WHEN category cards display THEN the System SHALL use Sequence component with size="L" (3 columns) and gap="M"
3. WHEN the viewport is mobile THEN the System SHALL reduce columns according to IDS responsive rules (4→2, 3→2)
4. WHEN cards render THEN the System SHALL maintain consistent aspect ratios (16/10 for images)

### Requirement 4

**User Story:** Как пользователь, я хочу видеть правильную ширину контента на страницах, чтобы текст не был слишком широким или узким.

#### Acceptance Criteria

1. WHEN the catalog index page renders THEN the System SHALL use Wrapper without size modifier (70% width on desktop)
2. WHEN text content renders THEN the System SHALL wrap it in TextWidth component (85% of Wrapper)
3. WHEN tool grids render THEN the System SHALL use Wrapper size="L" (85% width) for wider layouts
4. WHEN the tool page content section renders THEN the System SHALL use TextWidth to limit prose width to 70ch

### Requirement 5

**User Story:** Как пользователь, я хочу видеть консистентные стили компонентов каталога, чтобы интерфейс был единообразным.

#### Acceptance Criteria

1. WHEN badges render THEN the System SHALL use consistent padding (0.3em 0.7em), font-size (0.85em), and border-radius (0.3em)
2. WHEN buttons render THEN the System SHALL use IDS link colors and hover states
3. WHEN cards render THEN the System SHALL use Rounded component with radius="1em" for image containers
4. WHEN surface backgrounds render THEN the System SHALL use rgb(var(--ids__surface-RGB)) consistently

### Requirement 6

**User Story:** Как пользователь, я хочу видеть правильную структуру страницы инструмента, чтобы информация была логично организована.

#### Acceptance Criteria

1. WHEN the tool page header renders THEN the System SHALL use CSS Grid with proper gap (2em) and alignment
2. WHEN the tool page sections render THEN the System SHALL separate them with Space components
3. WHEN the FAQ section renders THEN the System SHALL use IDS aside styling or consistent card styling
4. WHEN related tools render THEN the System SHALL use proper section separation with border-top

### Requirement 7

**User Story:** Как пользователь, я хочу видеть правильный хедер и футер каталога, чтобы навигация была удобной.

#### Acceptance Criteria

1. WHEN the catalog header renders THEN the System SHALL use consistent padding based on density variable
2. WHEN the catalog footer renders THEN the System SHALL use FooterNav with proper grid layout
3. WHEN navigation links render THEN the System SHALL use IDS link styles with proper hover states
4. WHEN the logo renders THEN the System SHALL maintain proper sizing and alignment

### Requirement 8

**User Story:** Как пользователь, я хочу видеть правильные фильтры и поиск, чтобы легко находить нужные сервисы.

#### Acceptance Criteria

1. WHEN the tag filter renders THEN the System SHALL use consistent spacing and IDS surface colors
2. WHEN filter buttons render THEN the System SHALL use proper border-radius and transition effects
3. WHEN the search widget renders THEN the System SHALL integrate with IDS color variables
4. WHEN filter categories render THEN the System SHALL use proper label styling (uppercase, letter-spacing)
