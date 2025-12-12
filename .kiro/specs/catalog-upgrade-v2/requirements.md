# Requirements Document

## Introduction

Апгрейд AI Catalog CIS до уровня конкурента nsfw.tools с фокусом на русскоязычный рынок СНГ. Ключевые улучшения: система коллекций/категорий, расширенная SEO-структура с внутренними ссылками, решение проблемы с изображениями, акцент на Telegram-ботах и способах оплаты для РФ. Конкурентное преимущество — полная локализация для рынка, который игнорируют западные агрегаторы.

**Обязательное условие:** Все компоненты и стили ДОЛЖНЫ использовать IDS (Intuition Design System) — компоненты Wrapper, Space, Sequence, SequenceItem, Rounded, Sleepy, Section, TextWidth, Gallery, InlineGallery и CSS-переменные IDS.

## Glossary

- **Collection**: Тематическая подборка инструментов (AI Girlfriends, Image Generators, Telegram Bots)
- **Category Page**: Страница коллекции со списком инструментов и SEO-текстом
- **Breadcrumbs**: Навигационная цепочка для SEO и UX
- **Internal Link**: Внутренняя ссылка между страницами сайта для SEO
- **Tool Count Badge**: Счётчик количества инструментов в категории
- **Placeholder Image**: Заглушка изображения с названием сервиса
- **Featured Section**: Выделенный блок на главной странице
- **Comparison Table**: Таблица сравнения инструментов в категории
- **Payment Badge**: Визуальный индикатор способа оплаты (Карты РФ, Крипто, СБП)

## Requirements

### Requirement 1

**User Story:** Как пользователь, я хочу видеть инструменты сгруппированные по категориям, чтобы быстро найти нужный тип сервиса.

#### Acceptance Criteria

1. WHEN a user visits the homepage THEN the Catalog SHALL display category cards with tool count badges
2. WHEN a user clicks on a category card THEN the Catalog SHALL navigate to the category page with filtered tools
3. THE Catalog SHALL provide the following categories: AI Girlfriends (чат-боты для ролеплея), AI Image Generators (генераторы изображений), Telegram Bots (боты в Telegram), Free AI Tools (бесплатные сервисы), Russian-Friendly (принимают карты РФ)
4. WHEN a category page is rendered THEN the Catalog SHALL display SEO-оптимизированный текст с описанием категории

### Requirement 2

**User Story:** Как владелец сайта, я хочу иметь развитую структуру внутренних ссылок, чтобы улучшить SEO-позиции.

#### Acceptance Criteria

1. WHEN a Tool Page is rendered THEN the Catalog SHALL display breadcrumbs navigation (Главная → Категория → Инструмент)
2. WHEN a Tool Page is rendered THEN the Catalog SHALL display links to related tools in the same category
3. WHEN a Category Page is rendered THEN the Catalog SHALL display links to other categories in sidebar
4. WHEN any page is rendered THEN the Catalog SHALL include footer with links to all categories
5. THE Catalog SHALL generate internal links between tools that share common tags

### Requirement 3

**User Story:** Как пользователь, я хочу видеть информативные изображения инструментов, чтобы понимать что это за сервис.

#### Acceptance Criteria

1. WHEN a tool has no uploaded image THEN the Catalog SHALL generate a placeholder with tool name and category icon
2. WHEN a placeholder is generated THEN the Catalog SHALL use consistent styling with brand colors
3. THE Catalog SHALL support external image URLs from tool websites
4. WHEN an image fails to load THEN the Catalog SHALL display the placeholder fallback

### Requirement 4

**User Story:** Как пользователь из России, я хочу видеть выделенную информацию о способах оплаты, чтобы понимать смогу ли я оплатить сервис.

#### Acceptance Criteria

1. WHEN a Tool Card is rendered THEN the Catalog SHALL display payment badges (Карты РФ, Крипто, СБП, Бесплатно)
2. WHEN a tool accepts Russian cards THEN the Catalog SHALL highlight this with a prominent badge
3. WHEN a Category Page for Russian-Friendly tools is rendered THEN the Catalog SHALL display only tools accepting Russian payment methods
4. THE Catalog SHALL provide a dedicated filter for payment methods on the main catalog page

### Requirement 5

**User Story:** Как пользователь Telegram, я хочу видеть выделенный раздел с ботами, чтобы найти AI прямо в мессенджере.

#### Acceptance Criteria

1. WHEN a user visits /telegram-bots THEN the Catalog SHALL display a hero section explaining benefits of Telegram bots
2. WHEN a Telegram bot card is rendered THEN the Catalog SHALL display a prominent "Открыть в Telegram" button
3. THE Catalog SHALL display Telegram bots section on homepage as a featured category with special styling
4. WHEN a Telegram bot page is rendered THEN the Catalog SHALL include step-by-step guide for starting the bot

### Requirement 6

**User Story:** Как пользователь, я хочу сравнивать инструменты в категории, чтобы выбрать лучший для моих нужд.

#### Acceptance Criteria

1. WHEN a Category Page is rendered THEN the Catalog SHALL display a comparison table with key features
2. THE comparison table SHALL include columns: Название, Цена, Карты РФ, VPN, Русский язык, Рейтинг
3. WHEN a user clicks on a row in comparison table THEN the Catalog SHALL navigate to the tool page

### Requirement 7

**User Story:** Как владелец сайта, я хочу иметь расширенную SEO-разметку, чтобы получать больше органического трафика.

#### Acceptance Criteria

1. WHEN a Category Page is rendered THEN the Catalog SHALL include CollectionPage schema.org markup
2. WHEN a Tool Page is rendered THEN the Catalog SHALL include BreadcrumbList schema.org markup
3. THE Catalog SHALL generate separate sitemaps for tools and categories
4. WHEN a page is rendered THEN the Catalog SHALL include hreflang tag for ru-RU locale
5. THE Catalog SHALL include FAQ schema.org markup on tool pages with FAQ sections

### Requirement 8

**User Story:** Как контент-менеджер, я хочу легко добавлять инструменты в коллекции, чтобы поддерживать структуру каталога.

#### Acceptance Criteria

1. WHEN an admin edits a tool THEN Keystatic SHALL provide a multi-select field for collections
2. THE Catalog SHALL support a tool belonging to multiple collections
3. WHEN a new collection is needed THEN the admin SHALL be able to create it through Keystatic
4. THE Catalog SHALL automatically update category pages when tools are added or removed

### Requirement 9

**User Story:** Как пользователь, я хочу видеть актуальную информацию о доступности сервисов, чтобы не тратить время на заблокированные ресурсы.

#### Acceptance Criteria

1. WHEN a tool requires VPN THEN the Tool Card SHALL display a warning badge "Нужен VPN"
2. WHEN a tool is accessible without VPN THEN the Tool Card SHALL display a success badge "Без VPN"
3. THE Catalog SHALL provide a filter "Доступно без VPN" on the main page
4. WHEN a tool page is rendered THEN the Catalog SHALL include a section about access from Russia

