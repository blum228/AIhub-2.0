# Requirements Document

## Introduction

Апгрейд AI-каталога с фокусом на три ключевых направления: Landing Page, глобальная навигация и блог-система. Все компоненты используют IDS (Intuition Design System) стиль. Платформа ориентирована на русскоязычную аудиторию СНГ.

## Glossary

- **Platform**: Веб-сайт AI-каталога с каталогом инструментов и блогом
- **IDS**: Intuition Design System — дизайн-система для вёрстки, используемая в проекте
- **Tool**: AI-сервис в каталоге (чат-бот, генератор изображений и т.д.)
- **Collection**: Категория/подборка инструментов
- **Landing Page**: Главная страница с hero-секцией и ключевыми разделами
- **Header**: Верхняя навигационная панель сайта
- **Footer**: Нижняя часть страницы с навигацией и информацией
- **Blog Post**: Статья в блоге с контентом об AI-инструментах

## Requirements

### Requirement 1: Landing Page

**User Story:** As a visitor, I want to see an attractive landing page, so that I understand what the platform offers and can quickly navigate to relevant sections.

#### Acceptance Criteria

1.1. WHEN a user visits the root URL THEN the Platform SHALL display a hero section with headline, description and CTA button linking to catalog
1.2. WHEN the landing page loads THEN the Platform SHALL display a featured tools section with top 4 highest-rated items
1.3. WHEN the landing page loads THEN the Platform SHALL display category cards linking to all available collections
1.4. WHEN the landing page loads THEN the Platform SHALL display a "How it works" section with 3-4 steps explaining the platform
1.5. WHEN the landing page loads AND blog posts exist THEN the Platform SHALL display up to 3 recent blog posts
1.6. WHEN the landing page loads THEN the Platform SHALL use IDS components: Wrapper, Space, TextWidth, Sequence, Rounded

---

### Requirement 2: Global Header

**User Story:** As a user, I want a consistent header across all pages, so that I can easily navigate between sections.

#### Acceptance Criteria

2.1. WHEN any page loads THEN the Platform SHALL display a header with site logo and navigation links
2.2. WHEN the header is displayed THEN the Platform SHALL include links to: Home, Catalog, Blog, About
2.3. WHEN the viewport width is less than 768px THEN the Platform SHALL display a hamburger menu icon instead of navigation links
2.4. WHEN a user clicks the hamburger menu THEN the Platform SHALL display a full-screen mobile navigation overlay
2.5. WHEN a user clicks a link in mobile navigation THEN the Platform SHALL close the overlay and navigate to the page
2.6. WHEN the header is displayed THEN the Platform SHALL use IDS styling with proper spacing and typography

---

### Requirement 3: Global Footer

**User Story:** As a user, I want a footer with useful links and information, so that I can find additional resources and legal information.

#### Acceptance Criteria

3.1. WHEN any page loads THEN the Platform SHALL display a footer at the bottom
3.2. WHEN the footer is displayed THEN the Platform SHALL include navigation links grouped by section
3.3. WHEN the footer is displayed THEN the Platform SHALL include category links to all collections
3.4. WHEN the footer is displayed THEN the Platform SHALL include copyright notice with current year
3.5. WHEN the footer is displayed THEN the Platform SHALL use IDS styling with surface background color

---

### Requirement 4: Blog Index Page

**User Story:** As a visitor, I want to browse blog articles, so that I can learn about AI tools and trends.

#### Acceptance Criteria

4.1. WHEN a user visits /blog THEN the Platform SHALL display a list of published blog posts
4.2. WHEN the blog index loads THEN the Platform SHALL display posts sorted by publication date descending
4.3. WHEN a blog post card is displayed THEN the Platform SHALL show: title, excerpt, date, and cover image
4.4. WHEN a user clicks a blog post card THEN the Platform SHALL navigate to the full article page
4.5. WHEN the blog index loads THEN the Platform SHALL use IDS grid layout with Sequence component

---

### Requirement 5: Blog Post Page

**User Story:** As a reader, I want to read full blog articles with rich content, so that I can get detailed information about AI tools.

#### Acceptance Criteria

5.1. WHEN a user visits /blog/[slug] THEN the Platform SHALL display the full article content
5.2. WHEN an article is displayed THEN the Platform SHALL show: title, publication date, author name, and reading time
5.3. WHEN an article is displayed THEN the Platform SHALL render MDX content with IDS typography styles
5.4. WHEN an article references tools THEN the Platform SHALL display related tool cards at the bottom
5.5. WHEN an article is displayed THEN the Platform SHALL include Schema.org Article structured data
5.6. WHEN an article is displayed THEN the Platform SHALL use TextWidth component for optimal reading width

---

### Requirement 6: Blog Content Collection

**User Story:** As a content creator, I want to manage blog posts through content files, so that I can easily add and update articles.

#### Acceptance Criteria

6.1. WHEN a blog post is created THEN the Platform SHALL store it in src/content/blog directory as MDX file
6.2. WHEN a blog post is defined THEN the Platform SHALL require: title, description, publishedAt, author fields
6.3. WHEN a blog post is defined THEN the Platform SHALL optionally accept: coverImage, tags, relatedTools fields
6.4. WHEN blog posts are queried THEN the Platform SHALL validate content against the defined schema

