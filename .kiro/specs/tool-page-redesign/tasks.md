# Implementation Plan

- [x] 1. Создание базовых компонентов и утилит
  - [x] 1.1 Создать Schema.org генераторы (ProductSchema, FAQPageSchema, BreadcrumbListSchema)
    - Создать файл `src/lib/schema.ts` с функциями генерации JSON-LD
    - Реализовать валидацию обязательных полей
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  - [x] 1.2 Написать property-based тест для Schema.org генераторов
    - **Property 4: Schema.org validity**
    - **Validates: Requirements 7.1, 7.2, 7.4**
    - Использовать fast-check для генерации случайных ToolData
    - Проверять валидность JSON и наличие обязательных полей

- [x] 2. Реализация Hero-секции
  - [x] 2.1 Создать компонент ToolHero.astro
    - Реализовать layout с изображением и информацией
    - Добавить отображение рейтинга со звёздами
    - Добавить компактные бейджи доступности
    - Добавить CTA кнопки (primary/secondary)
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  - [x] 2.2 Написать property-based тест для Hero completeness
    - **Property 1: Hero completeness**
    - **Validates: Requirements 1.1, 1.3, 1.4**
    - Проверять наличие всех обязательных элементов

- [x] 3. Реализация блока доступности
  - [x] 3.1 Создать компонент AccessBar.astro (горизонтальный)
    - Реализовать компактное горизонтальное отображение
    - Использовать семантические цвета IDS (success/warning/info)
    - Показывать VPN, карты РФ, язык, способы оплаты
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  - [x] 3.2 Написать property-based тест для Restrictions display
    - **Property 2: Restrictions display consistency**
    - **Validates: Requirements 2.2, 2.3, 4.3**
    - Проверять корректность цветовой индикации

- [x] 4. Checkpoint - Убедиться что все тесты проходят
  - All new tests pass (30 tests)

- [x] 5. Реализация Sticky Sidebar
  - [x] 5.1 Создать компонент ToolSidebar.astro
    - Реализовать sticky позиционирование
    - Добавить CTA кнопку и информацию о цене
    - Добавить подсказки по оплате и VPN
    - _Requirements: 4.1, 4.2, 4.3_

- [x] 6. Реализация FAQ-секции
  - [x] 6.1 Создать/модифицировать компонент FaqSection.astro
    - Реализовать аккордеон с плавной анимацией
    - Использовать типографику IDS
    - Условный рендеринг (не показывать если FAQ пуст)
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  - [x] 6.2 Написать property-based тест для FAQ conditional rendering
    - **Property 3: FAQ conditional rendering**
    - **Validates: Requirements 5.1, 5.4**
    - Проверять условный рендеринг и генерацию Schema

- [x] 7. Улучшение Related Tools
  - [x] 7.1 Модифицировать компонент RelatedTools.astro
    - Реализовать приоритизацию по коллекциям и тегам (добавлена функция findRelatedToolsWithCollections в tools.ts)
    - Обновить карточки с бейджами доступности
    - _Requirements: 6.1, 6.2, 6.3_
  - [x] 7.2 Написать property-based тест для Related tools relevance
    - **Property 5: Related tools relevance**
    - **Validates: Requirements 6.3**
    - Проверять приоритизацию коллекций

- [x] 8. Checkpoint - Убедиться что все тесты проходят
  - All tests pass (33 tests including textWidth)

- [x] 9. Мобильная адаптивность
  - [x] 9.1 Создать компонент MobileCta.astro
    - Реализовать фиксированную кнопку внизу экрана
    - Показывать только на мобильных (< 768px)
    - _Requirements: 4.4, 8.2_
  - [x] 9.2 Добавить адаптивные стили для всех компонентов
    - Одноколоночный layout для мобильных
    - Адаптивное отображение таблиц
    - Hero с изображением над текстом
    - _Requirements: 8.1, 8.3, 8.4_

- [x] 10. Интеграция в страницу tool/[slug].astro
  - [x] 10.1 Обновить страницу tool/[slug].astro
    - Интегрировать все новые компоненты
    - Добавить Schema.org разметку в head
    - Реализовать двухколоночный layout
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 11. Final Checkpoint - Убедиться что все тесты проходят
  - All tests pass, no TypeScript errors
