# Implementation Plan

- [ ] 1. Создать функции выборки данных
  - [ ] 1.1 Создать файл `src/lib/landing.ts` с функциями getTopRatedTools, getRecentTools, getNoVpnTools, getRussianCardsTools, getStats
    - Функции должны быть чистыми и тестируемыми
    - _Requirements: 1.2, 3.1, 3.2, 4.1, 4.2_
  - [ ]* 1.2 Написать property test для getTopRatedTools
    - **Property 4: Top rated selection**
    - **Validates: Requirements 3.1**
  - [ ]* 1.3 Написать property test для getRecentTools
    - **Property 5: Recent tools selection**
    - **Validates: Requirements 3.2**
  - [ ]* 1.4 Написать property test для getNoVpnTools
    - **Property 7: No VPN filter correctness**
    - **Validates: Requirements 4.1**
  - [ ]* 1.5 Написать property test для getRussianCardsTools
    - **Property 8: Russian cards filter correctness**
    - **Validates: Requirements 4.2**
  - [ ]* 1.6 Написать property test для getStats
    - **Property 1: Stats counter accuracy**
    - **Validates: Requirements 1.2**

- [ ] 2. Checkpoint - Убедиться что все тесты проходят
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 3. Создать компонент StatsCounter
  - [ ] 3.1 Создать `src/components/landing/StatsCounter.astro`
    - Принимает toolsCount и categoriesCount
    - Использует IDS Sequence, SequenceItem, Sleepy
    - Отображает "X инструментов", "Y категорий", badge "Обновлено"
    - _Requirements: 1.2_

- [ ] 4. Создать компонент QuickFilters
  - [ ] 4.1 Создать `src/components/landing/QuickFilters.astro`
    - Кнопки-ссылки: "Без VPN", "Карты РФ", "Бесплатные"
    - Использует IDS стили .ids__promo-link
    - _Requirements: 1.3_

- [ ] 5. Создать компонент HeroSection
  - [ ] 5.1 Создать `src/components/landing/HeroSection.astro`
    - Объединяет заголовок, подзаголовок, SearchWidget, StatsCounter, QuickFilters
    - Использует IDS TextWidth, Space
    - _Requirements: 1.1, 1.2, 1.3_

- [ ] 6. Создать компонент FeaturedCategories
  - [ ] 6.1 Создать `src/components/landing/FeaturedCategories.astro`
    - Принимает categories и tools для подсчёта
    - Отображает сетку карточек с иконкой, названием, описанием, счётчиком
    - Использует IDS Sequence, SequenceItem, Rounded
    - _Requirements: 2.1, 2.2_
  - [ ]* 6.2 Написать property test для отображения всех категорий
    - **Property 2: All categories displayed**
    - **Validates: Requirements 2.1**
  - [ ]* 6.3 Написать property test для полноты данных в карточках
    - **Property 3: Category card completeness**
    - **Validates: Requirements 2.2**

- [ ] 7. Создать универсальный компонент FeaturedToolsSection
  - [ ] 7.1 Создать `src/components/landing/FeaturedToolsSection.astro`
    - Принимает title, tools, viewAllLink, viewAllText
    - Отображает заголовок секции и сетку карточек инструментов
    - Использует IDS Space, Sequence, SequenceItem, Rounded, Aside
    - _Requirements: 3.1, 3.2, 3.3, 4.1, 4.2_
  - [ ]* 7.2 Написать property test для полноты данных в карточках инструментов
    - **Property 6: Tool card completeness**
    - **Validates: Requirements 3.3**

- [ ] 8. Создать компонент Footer
  - [ ] 8.1 Создать `src/components/landing/Footer.astro`
    - Принимает categories для генерации ссылок
    - Отображает ссылки на категории, статические страницы, copyright, соцсети
    - Использует IDS Wrapper, Sequence, SequenceItem
    - _Requirements: 5.1, 5.2, 5.3_
  - [ ]* 8.2 Написать property test для полноты ссылок на категории
    - **Property 9: Footer category links completeness**
    - **Validates: Requirements 5.1**

- [ ] 9. Checkpoint - Убедиться что все тесты проходят
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Обновить главную страницу каталога
  - [ ] 10.1 Обновить `src/pages/catalog/index.astro`
    - Импортировать и использовать все новые компоненты
    - Вызвать функции выборки данных
    - Собрать полную Landing Page структуру
    - _Requirements: 1.1, 2.1, 3.1, 3.2, 4.1, 4.2, 5.1_

- [ ] 11. Final Checkpoint - Убедиться что все тесты проходят
  - Ensure all tests pass, ask the user if questions arise.

