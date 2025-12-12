# Implementation Plan

- [x] 1. Исправить CatalogLayout.astro
  - [x] 1.1 Исправить стили header — использовать IDS density-based padding
    - Заменить кастомный padding на `calc(var(--ids__density) * 0.5em)`
    - Исправить стили навигации для соответствия IDS link styles
    - _Requirements: 7.1, 7.3, 7.4_
  - [x] 1.2 Исправить стили footer
    - Убрать дублирование стилей с FooterNav
    - Использовать IDS density-based padding
    - _Requirements: 7.2_

- [x] 2. Исправить главную страницу каталога (catalog/index.astro)
  - [x] 2.1 Исправить hero секцию
    - Обернуть в TextWidth для ограничения ширины
    - Убрать кастомный font-size для h1 (использовать IDS h1 или h1.S)
    - Заменить hero__subtitle на p.loud (IDS класс)
    - Добавить Space size="XL" перед hero
    - _Requirements: 1.2, 2.1, 2.3, 4.2_
  - [x] 2.2 Исправить секцию категорий
    - Заменить CSS Grid (.categories-grid) на Sequence size="L" gap="M"
    - Убрать кастомный section-title стиль, использовать h2 без модификаций
    - Добавить Space size="L" перед секцией
    - _Requirements: 1.2, 1.3, 2.4, 3.2_
  - [x] 2.3 Исправить секцию инструментов
    - Убрать кастомный section-title стиль
    - Добавить Space size="M" между TagFilter и заголовком
    - _Requirements: 1.3, 2.4_
  - [x] 2.4 Исправить featured секцию (Telegram боты)
    - Использовать IDS surface background
    - Исправить section-title__link стиль
    - Добавить Space size="L" перед секцией
    - _Requirements: 1.3, 5.4_

- [x] 3. Исправить страницу инструмента (tool/[slug].astro)
  - [x] 3.1 Исправить header секцию
    - Исправить grid gap и alignment
    - Унифицировать стили badges (padding, font-size, border-radius)
    - _Requirements: 5.1, 6.1_
  - [x] 3.2 Исправить content секцию
    - Обернуть Content в TextWidth
    - Добавить Space size="L" после header
    - _Requirements: 4.4, 6.2_
  - [x] 3.3 Исправить секции AccessInfo, PaymentGuide, TelegramGuide
    - Добавить Space size="M" между секциями
    - _Requirements: 1.3, 6.2_
  - [x] 3.4 Исправить FAQ секцию
    - Использовать IDS aside стили или унифицировать с surface
    - Добавить Space size="M" перед секцией
    - _Requirements: 5.4, 6.3_

- [x] 4. Исправить компонент CategoryCard.astro
  - [x] 4.1 Проверить и исправить использование Rounded
    - Убедиться что radius="1em" применяется корректно
    - Исправить внутренние отступы на density-based
    - _Requirements: 5.3_

- [x] 5. Исправить компонент ToolCard.astro
  - [x] 5.1 Унифицировать стили badges
    - Привести padding к 0.3em 0.7em
    - Привести font-size к 0.85em
    - Привести border-radius к 0.3em
    - _Requirements: 5.1_
  - [x] 5.2 Проверить использование Rounded для изображений
    - Убедиться что radius="1em" применяется
    - _Requirements: 5.3_

- [x] 6. Исправить компонент TagFilter.astro
  - [x] 6.1 Исправить spacing и стили
    - Использовать IDS surface color
    - Исправить border-radius на var(--ids__radius)
    - Унифицировать button стили
    - _Requirements: 8.1, 8.2, 8.4_

- [x] 7. Исправить компонент FooterNav.astro
  - [x] 7.1 Исправить grid layout
    - Использовать правильные gap значения
    - Исправить стили ссылок для соответствия IDS
    - _Requirements: 7.2, 7.3_

- [x] 8. Исправить компонент SearchWidget.astro
  - [x] 8.1 Интегрировать с IDS цветовыми переменными
    - Проверить использование --ids__link-RGB, --ids__surface-RGB
    - Исправить border-radius на var(--ids__radius)
    - _Requirements: 8.3_

- [ ] 9. Финальная проверка
  - [ ] 9.1 Visual testing — проверить все страницы в браузере
    - Сравнить с референсом ids-demo.astro
    - Проверить responsive поведение (desktop/mobile)
    - _Requirements: все_
  - [ ] 9.2 Code review checklist
    - Проверить использование Space компонентов
    - Проверить использование TextWidth
    - Проверить использование Sequence
    - Проверить отсутствие кастомных font-size для заголовков
    - _Requirements: все_
