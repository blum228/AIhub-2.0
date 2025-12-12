# Requirements Document

## Introduction

Набор статических информационных страниц для полноценной платформы: О нас, FAQ, Контакты, Privacy Policy, Terms of Service. Эти страницы важны для доверия пользователей и SEO.

**Обязательное условие:** Весь дизайн ДОЛЖЕН использовать IDS (Intuition Design System). Референс стиля: `/src/pages/ids-demo.astro`.

## Glossary

- **Static Page**: Информационная страница с фиксированным контентом
- **FAQ Page**: Страница часто задаваемых вопросов
- **Contact Form**: Форма обратной связи

## Requirements

### Requirement 1: Страница "О нас"

**User Story:** Как посетитель, я хочу узнать о платформе и её миссии.

#### Acceptance Criteria

1. WHEN a user visits /about THEN the Platform SHALL display page with mission statement using IDS TextWidth
2. WHEN the about page is rendered THEN the Platform SHALL display "Почему мы" section with value propositions
3. WHEN the about page is rendered THEN the Platform SHALL display team or project info

### Requirement 2: FAQ страница

**User Story:** Как пользователь, я хочу найти ответы на частые вопросы.

#### Acceptance Criteria

1. WHEN a user visits /faq THEN the Platform SHALL display FAQ list grouped by topics
2. WHEN FAQ is rendered THEN the Platform SHALL use expandable accordion using IDS details/summary styling
3. WHEN FAQ page is rendered THEN the Platform SHALL include FAQPage schema.org markup

### Requirement 3: Контакты

**User Story:** Как пользователь, я хочу связаться с командой платформы.

#### Acceptance Criteria

1. WHEN a user visits /contact THEN the Platform SHALL display contact form with fields: имя, email, сообщение
2. WHEN the contact page is rendered THEN the Platform SHALL display social links (Telegram, email)

### Requirement 4: Юридические страницы

**User Story:** Как пользователь, я хочу ознакомиться с правилами использования.

#### Acceptance Criteria

1. WHEN a user visits /privacy THEN the Platform SHALL display privacy policy using IDS TextWidth
2. WHEN a user visits /terms THEN the Platform SHALL display terms of service

