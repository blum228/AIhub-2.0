# Requirements Document

## Introduction

Добавление блога и системы гайдов на платформу. Блог нужен для SEO-трафика, обучения пользователей и позиционирования как экспертного ресурса. Гайды помогут пользователям разобраться с оплатой, VPN и использованием сервисов.

**Обязательное условие:** Весь дизайн ДОЛЖЕН использовать IDS (Intuition Design System). Референс стиля: `/src/pages/ids-demo.astro`.

## Glossary

- **Blog Post**: Статья в блоге с заголовком, контентом и метаданными
- **Guide**: Пошаговая инструкция по решению конкретной задачи
- **Post Type**: Тип статьи (обзор, сравнение, гайд, новость)
- **Reading Time**: Расчётное время чтения статьи

## Requirements

### Requirement 1: Список статей

**User Story:** Как пользователь, я хочу видеть список статей блога для изучения темы.

#### Acceptance Criteria

1. WHEN a user visits /blog THEN the Platform SHALL display list of blog posts using IDS Sequence component
2. WHEN a post card is rendered THEN the Platform SHALL display thumbnail, title, excerpt, date and reading time
3. WHEN the blog page is rendered THEN the Platform SHALL display filter by post type (Обзоры, Сравнения, Гайды, Новости)
4. WHEN blog has more than 10 posts THEN the Platform SHALL display pagination

### Requirement 2: Страница статьи

**User Story:** Как читатель, я хочу комфортно читать статью с хорошей типографикой.

#### Acceptance Criteria

1. WHEN a blog post page is rendered THEN the Platform SHALL display article using IDS TextWidth and typography styles
2. WHEN a post is rendered THEN the Platform SHALL display title, author, date, reading time and post type badge
3. WHEN a post is rendered THEN the Platform SHALL display table of contents for long articles
4. WHEN a post is rendered THEN the Platform SHALL display related posts section
5. WHEN a post is rendered THEN the Platform SHALL include Article schema.org markup

### Requirement 3: Гайды

**User Story:** Как пользователь, я хочу найти пошаговые инструкции по конкретным задачам.

#### Acceptance Criteria

1. WHEN a user visits /guides THEN the Platform SHALL display list of guides grouped by topic
2. WHEN a guide page is rendered THEN the Platform SHALL display numbered steps using IDS Sequence component
3. THE Platform SHALL include guides: "Как оплатить криптой", "Как настроить VPN", "Как начать с Telegram ботами"

### Requirement 4: Контент в Keystatic

**User Story:** Как контент-менеджер, я хочу добавлять статьи через админку.

#### Acceptance Criteria

1. WHEN an admin accesses /keystatic THEN Keystatic SHALL display forms for blog posts and guides
2. THE blog post schema SHALL include: title, slug, excerpt, content, coverImage, postType, author, publishedAt
3. THE guide schema SHALL include: title, slug, description, steps array, relatedTools

