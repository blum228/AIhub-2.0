# Requirements Document

## Introduction

Редизайн главной страницы каталога в полноценную Landing Page с hero-секцией, статистикой, featured блоками и улучшенной структурой. Цель — создать привлекательную точку входа, которая чётко показывает ценность платформы и направляет пользователей к нужному контенту.

**Обязательное условие:** Весь дизайн ДОЛЖЕН использовать IDS (Intuition Design System). Референс стиля: `/src/pages/ids-demo.astro`.

## Glossary

- **Hero Section**: Главный блок страницы с заголовком, описанием и призывом к действию
- **Stats Counter**: Анимированный счётчик статистики
- **Featured Section**: Выделенный блок с акцентным контентом
- **Category Card**: Карточка категории с иконкой и счётчиком инструментов
- **IDS Component**: Компонент из Intuition Design System

## Requirements

### Requirement 1: Hero секция

**User Story:** Как посетитель, я хочу сразу понять что это за сайт и начать поиск.

#### Acceptance Criteria

1. WHEN a user visits the homepage THEN the Platform SHALL display hero section with headline "AI Каталог для СНГ", subheadline и search input using IDS TextWidth and Space components
2. WHEN the hero is rendered THEN the Platform SHALL display animated stats counters: количество инструментов, количество категорий using IDS Sleepy component
3. WHEN the hero is rendered THEN the Platform SHALL display quick filter buttons: "Без VPN", "Карты РФ", "Бесплатные" using IDS styling

### Requirement 2: Featured категории

**User Story:** Как пользователь, я хочу видеть основные категории для быстрой навигации.

#### Acceptance Criteria

1. WHEN the homepage is rendered THEN the Platform SHALL display category cards grid using IDS Sequence component
2. WHEN a category card is rendered THEN the Platform SHALL display icon, title, description and tool count badge
3. WHEN a user clicks category card THEN the Platform SHALL navigate to category page

### Requirement 3: Топ сервисы

**User Story:** Как пользователь, я хочу видеть лучшие сервисы сразу на главной.

#### Acceptance Criteria

1. WHEN the homepage is rendered THEN the Platform SHALL display "Топ недели" section with 4 highest rated tools using IDS Rounded cards
2. WHEN the homepage is rendered THEN the Platform SHALL display "Новые сервисы" section with 4 recently added tools
3. WHEN a featured tool card is rendered THEN the Platform SHALL display cover, title, rating and primary badge

### Requirement 4: Тематические блоки

**User Story:** Как пользователь из России, я хочу быстро найти доступные мне сервисы.

#### Acceptance Criteria

1. WHEN the homepage is rendered THEN the Platform SHALL display "Работают без VPN" featured section with tools where requiresVpn=false
2. WHEN the homepage is rendered THEN the Platform SHALL display "Принимают карты РФ" featured section with tools where acceptsRussianCards=true
3. WHEN a featured section is rendered THEN the Platform SHALL use IDS Aside component for visual distinction

### Requirement 5: Footer

**User Story:** Как пользователь, я хочу найти ссылки на все разделы сайта.

#### Acceptance Criteria

1. WHEN the footer is rendered THEN the Platform SHALL display links to all categories
2. WHEN the footer is rendered THEN the Platform SHALL display links to static pages (О нас, FAQ, Контакты)
3. WHEN the footer is rendered THEN the Platform SHALL display copyright and social links

