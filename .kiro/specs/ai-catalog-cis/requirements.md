# Requirements Document

## Introduction

AI Catalog CIS — агрегатор AI-сервисов для ролеплея и генерации контента 18+, ориентированный на русскоязычную аудиторию СНГ. Платформа решает ключевые проблемы пользователей из России и СНГ: языковой барьер, блокировки VPN, сложности с оплатой западных сервисов. Проект использует дизайн-систему IDS и стек Astro + Keystatic + Pagefind.

## Glossary

- **Catalog**: Веб-приложение для просмотра и поиска AI-сервисов
- **Tool**: Отдельный AI-сервис (чат-бот, генератор изображений, Telegram-бот)
- **Tool Card**: Карточка сервиса в списке с превью, названием и тегами
- **Tool Page**: Детальная страница сервиса с полным описанием и гайдами
- **Tag**: Метка для фильтрации сервисов (тип, возможности, способ оплаты)
- **Safe Mode**: Режим размытия NSFW-контента для безопасного просмотра
- **Pagefind**: Статический поисковый движок для Astro-сайтов
- **Keystatic**: CMS для управления контентом через файловую систему
- **IDS**: Intuition Design System — дизайн-система для вёрстки

## Requirements

### Requirement 1

**User Story:** Как пользователь, я хочу видеть каталог AI-сервисов на главной странице, чтобы быстро найти нужный инструмент.

#### Acceptance Criteria

1. WHEN a user visits the homepage THEN the Catalog SHALL display a grid of Tool Cards sorted by rating
2. WHEN a Tool Card is rendered THEN the Catalog SHALL show the tool name, short description, cover image, price model badge, and primary tags
3. WHEN a user hovers over a Tool Card with GIF preview THEN the Catalog SHALL animate the preview image
4. WHEN the page loads THEN the Catalog SHALL display a hero section with site description and search input

### Requirement 2

**User Story:** Как пользователь, я хочу фильтровать сервисы по тегам, чтобы найти подходящий под мои требования.

#### Acceptance Criteria

1. WHEN a user selects a tag filter THEN the Catalog SHALL display only tools matching the selected tag
2. WHEN multiple tags are selected THEN the Catalog SHALL display tools matching all selected tags (AND logic)
3. WHEN a user clears all filters THEN the Catalog SHALL display all tools
4. THE Catalog SHALL provide the following filter categories: tool type (Chatbot, Image Gen, Video, Telegram Bot), language support (Russian), payment method (Russian cards, Crypto, Free), and access type (No VPN required)

### Requirement 3

**User Story:** Как пользователь, я хочу искать сервисы по названию и описанию, чтобы быстро найти конкретный инструмент.

#### Acceptance Criteria

1. WHEN a user enters a search query THEN the Catalog SHALL display matching tools within 200ms
2. WHEN search results are displayed THEN the Catalog SHALL highlight matching text fragments
3. WHEN no results match the query THEN the Catalog SHALL display a message with search suggestions
4. THE Catalog SHALL support search in Russian language with typo tolerance

### Requirement 4

**User Story:** Как пользователь, я хочу просматривать детальную страницу сервиса, чтобы узнать все подробности перед использованием.

#### Acceptance Criteria

1. WHEN a user opens a Tool Page THEN the Catalog SHALL display full description, screenshots gallery, pricing information, and affiliate link
2. WHEN a Tool Page is rendered THEN the Catalog SHALL display FAQ section with common questions
3. WHEN a tool requires special payment method THEN the Tool Page SHALL display a payment guide section
4. WHEN a Tool Page is rendered THEN the Catalog SHALL display related tools section

### Requirement 5

**User Story:** Как пользователь, я хочу включить безопасный режим, чтобы просматривать каталог в публичных местах.

#### Acceptance Criteria

1. WHEN a user enables Safe Mode THEN the Catalog SHALL blur all NSFW images with a CSS filter
2. WHEN Safe Mode is enabled THEN the Catalog SHALL persist the setting in localStorage
3. WHEN a user disables Safe Mode THEN the Catalog SHALL immediately remove blur from all images
4. THE Catalog SHALL display a visible toggle for Safe Mode in the header

### Requirement 6

**User Story:** Как контент-менеджер, я хочу добавлять и редактировать сервисы через админку, чтобы поддерживать каталог актуальным.

#### Acceptance Criteria

1. WHEN an admin accesses /keystatic THEN the Catalog SHALL display a form with all tool fields
2. WHEN an admin saves a tool THEN Keystatic SHALL create or update an MDX file in src/content/tools/
3. THE Catalog SHALL support the following tool fields: title, slug, cover image, short description, full content, tags (multi-select), price model, NSFW flag, affiliate link, and rating
4. WHEN an admin uploads an image THEN Keystatic SHALL store the image in public/images/tools/

### Requirement 7

**User Story:** Как владелец сайта, я хочу чтобы страницы имели правильную SEO-разметку, чтобы получать органический трафик из поисковиков.

#### Acceptance Criteria

1. WHEN a Tool Page is rendered THEN the Catalog SHALL include meta title, description, and Open Graph tags
2. WHEN a Tool Page is rendered THEN the Catalog SHALL include Product and AggregateRating schema.org markup
3. THE Catalog SHALL generate a sitemap.xml with all tool pages
4. WHEN a page is rendered THEN the Catalog SHALL include canonical URL meta tag

### Requirement 8

**User Story:** Как пользователь, я хочу видеть отдельный раздел с Telegram-ботами, чтобы найти ботов для мессенджера.

#### Acceptance Criteria

1. WHEN a user visits /telegram-bots THEN the Catalog SHALL display only tools tagged as Telegram Bot
2. WHEN a Telegram Bot card is rendered THEN the Catalog SHALL display a direct link to the bot
3. THE Catalog SHALL display Telegram bots section on the homepage as a featured category

### Requirement 9

**User Story:** Как разработчик, я хочу чтобы данные о сервисах хранились в MDX-файлах, чтобы управлять контентом через Git.

#### Acceptance Criteria

1. THE Catalog SHALL store all tool data in src/content/tools/*.mdx files
2. WHEN Astro builds the site THEN the Catalog SHALL generate static HTML pages from MDX content
3. THE Catalog SHALL validate tool frontmatter against a defined schema using Astro Content Collections
4. WHEN a tool MDX file is invalid THEN the build process SHALL fail with a descriptive error message

