# Implementation Plan

- [x] 1. Рефакторинг HeroSection
  - [x] 1.1 Удалить градиент и кастомные стили из HeroSection
    - Удалить `background: linear-gradient(...)` из .hero
    - Удалить кастомные clamp() из .hero__headline и .hero__description
    - Использовать стандартные классы IDS: h1.S, p.loud
    - _Requirements: 2.1, 2.3, 11.2_
  - [x] 1.2 Заменить кастомную CTA-кнопку на стандартную ссылку IDS
    - Удалить класс .hero__cta и его стили
    - Использовать стандартную ссылку `<a href="/catalog">Открыть каталог →</a>`
    - _Requirements: 2.2_
  - [x] 1.3 Убрать центрирование с Hero-секции
    - Удалить `text-align: center` с .hero
    - Использовать стандартное левое выравнивание IDS
    - _Requirements: 2.4_
  - [x] 1.4 Write property test for no gradients
    - **Property 3: No Gradients in Styles**
    - **Validates: Requirements 8.3**

- [x] 2. Рефакторинг GlobalHeader
  - [x] 2.1 Убрать sticky позиционирование
    - Удалить `position: sticky` и `top: 0` из .global-header
    - Удалить `z-index: 100`
    - _Requirements: 3.1_
  - [x] 2.2 Заменить фон на background-RGB
    - Изменить `background: rgb(var(--ids__surface-RGB))` на `background: rgb(var(--ids__background-RGB))`
    - _Requirements: 3.2_
  - [x] 2.3 Убрать кастомный размер логотипа
    - Удалить `font-size: 1.3em` из .global-header__logo
    - Использовать стандартный размер текста IDS
    - _Requirements: 3.3_
  - [x] 2.4 Write property test for CSS variables consistency
    - **Property 1: CSS Variables Consistency**
    - **Validates: Requirements 5.1, 5.2, 5.3**

- [x] 3. Checkpoint - Make sure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Рефакторинг ToolCard
  - [x] 4.1 Заменить кастомный radius на IDS radius
    - Изменить `<Rounded radius="1em">` на `<Rounded>` (использует var(--ids__radius))
    - _Requirements: 4.1, 5.2_
  - [x] 4.2 Убрать hover-scale эффект
    - Удалить `transform: scale(1.05)` из .tool-card:hover .tool-card__image
    - Оставить только изменение цвета заголовка
    - _Requirements: 4.4, 8.2_
  - [x] 4.3 Write property test for no transform on hover
    - **Property 2: No Transform Animations on Hover**
    - **Validates: Requirements 4.4, 8.1, 8.2, 8.4**

- [x] 5. Рефакторинг CategoryCard
  - [x] 5.1 Заменить кастомные стили на aside IDS
    - Использовать стандартный `<aside>` вместо кастомного .category-card__inner
    - Удалить кастомные flex-стили
    - _Requirements: 4.2_
  - [x] 5.2 Убрать hover-transform
    - Удалить `transform: translateY(-2px)` из .category-card:hover
    - _Requirements: 4.4, 8.1_

- [x] 6. Рефакторинг страницы инструмента (tool/[slug].astro)
  - [x] 6.1 Заменить двухколоночный grid на вертикальный layout
    - Удалить `grid-template-columns: 1fr 1fr` из .tool-page__header
    - Использовать вертикальную компоновку с Space
    - _Requirements: 6.1_
  - [x] 6.2 Заменить множество badges на aside
    - Объединить .tool-page__meta badges в один блок `<aside>`
    - Использовать стандартные code/mark для выделений
    - _Requirements: 4.3, 6.2_
  - [x] 6.3 Заменить CTA-кнопки на ids__promo-link
    - Использовать класс `.ids__promo-link` для группы ссылок
    - Удалить кастомные стили .tool-page__cta и .tool-page__telegram
    - _Requirements: 6.3_
  - [x] 6.4 Заменить FAQ dl-список на details/summary
    - Использовать нативный `<details><summary>` вместо кастомного .faq-list
    - _Requirements: 6.4_

- [x] 7. Checkpoint - Make sure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Рефакторинг страницы категории (category/[slug].astro)
  - [x] 8.1 Убрать двухколоночный grid
    - Удалить `grid-template-columns: 1fr 280px` из .category-layout
    - Переместить sidebar в конец страницы
    - _Requirements: 7.2_
  - [x] 8.2 Использовать TextWidth для контента
    - Обернуть .category-content в TextWidth
    - Удалить кастомные padding и border-radius
    - _Requirements: 7.4_
  - [x] 8.3 Write property test for TextWidth usage
    - **Property 6: TextWidth for Content Restriction**
    - **Validates: Requirements 7.4**

- [x] 9. Рефакторинг BlogCard
  - [x] 9.1 Убрать aspect-ratio с изображения
    - Удалить `aspect-ratio: 16 / 9` из .blog-card__image-wrapper
    - Использовать естественные пропорции изображения
    - _Requirements: 10.1_
  - [x] 9.2 Убрать hover-scale
    - Удалить `transform: scale(1.05)` из .blog-card:hover .blog-card__image
    - _Requirements: 8.2_

- [x] 10. Рефакторинг страницы блог-поста (blog/[slug].astro)
  - [x] 10.1 Убрать центрирование header
    - Удалить `text-align: center` из .blog-post__header
    - _Requirements: 10.2_
  - [x] 10.2 Упростить meta-блок
    - Удалить `justify-content: center` из .blog-post__meta
    - Использовать простой текст без flex
    - _Requirements: 10.3_

- [x] 11. Рефакторинг GlobalFooter
  - [x] 11.1 Заменить CSS Grid на вертикальный layout
    - Удалить `grid-template-columns` из .global-footer__inner
    - Использовать вертикальную компоновку с Space
    - _Requirements: 9.1_
  - [x] 11.2 Убрать border-top разделители
    - Заменить `border-top` на компонент Space
    - _Requirements: 9.4_
  - [x] 11.3 Убрать центрирование copyright
    - Удалить `text-align: center` из .global-footer__bottom
    - _Requirements: 9.3_

- [x] 12. Рефакторинг HowItWorks
  - [x] 12.1 Убрать центрирование
    - Удалить `text-align: center` из .how-it-works__step
    - _Requirements: 2.4_
  - [x] 12.2 Упростить стили шагов
    - Использовать стандартный aside IDS вместо кастомных стилей
    - Удалить кастомные .how-it-works__number стили
    - _Requirements: 4.2_

- [x] 13. Checkpoint - Make sure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 14. Рефакторинг FeaturedTools и CategoryCards
  - [x] 14.1 Убрать центрирование заголовков
    - Удалить `text-align: center` из .featured-tools__title и .category-cards__title
    - _Requirements: 2.4_

- [x] 15. Глобальная очистка CSS
  - [x] 15.1 Удалить все clamp() из font-size
    - Найти и заменить все clamp() на стандартные размеры IDS
    - _Requirements: 11.2_
  - [x] 15.2 Заменить хардкод-цвета на переменные IDS
    - Найти все хардкод-цвета (#xxx, rgb(), rgba()) и заменить на var(--ids__*-RGB)
    - _Requirements: 5.3_
  - [x] 15.3 Заменить хардкод border-radius на var(--ids__radius)
    - Найти все border-radius с фиксированными значениями
    - _Requirements: 5.2_
  - [x] 15.4 Write property test for font size consistency
    - **Property 4: Font Size Consistency**
    - **Validates: Requirements 11.1, 11.2, 11.4**
  - [x] 15.5 Write property test for Rounded radius
    - **Property 5: Rounded Components Use IDS Radius**
    - **Validates: Requirements 4.1, 5.2**

- [x] 16. Final Checkpoint - Make sure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
