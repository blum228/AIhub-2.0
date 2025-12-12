# Implementation Plan

- [x] 1. Создание компонента Dialog
  - [x] 1.1 Создать компонент Dialog.astro
    - Контейнер для диалога с отступами
    - Использовать CSS-переменные IDS для отступов
    - _Requirements: 1.3_
  - [x] 1.2 Создать компонент DialogLine.astro
    - Реплика с тире (—) в начале
    - Корректный перенос длинных строк с сохранением отступа
    - _Requirements: 1.1, 1.2, 1.4_
  - [ ]* 1.3 Написать property-based тест для DialogLine
    - **Property 1: Dialog lines have dash prefix**
    - **Validates: Requirements 1.1**
    - Проверять наличие em-dash в выходном HTML

- [x] 2. Создание компонента Remark
  - [x] 2.1 Создать компонент Remark.astro
    - Текст в скобках курсивом
    - Уменьшенный отступ сверху
    - _Requirements: 2.1, 2.2, 2.3_
  - [ ]* 2.2 Написать property-based тест для Remark
    - **Property 2: Remark adds parentheses**
    - **Validates: Requirements 2.1, 2.3**
    - Проверять наличие скобок вокруг контента

- [x] 3. Checkpoint - Убедиться что все тесты проходят
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Расширение компонента Aside типами
  - [x] 4.1 Модифицировать Aside.astro
    - Добавить prop type: 'default' | 'warning' | 'tip'
    - Добавить CSS-классы для разных типов
    - Использовать семантические цвета IDS
    - _Requirements: 3.1, 3.2, 3.3_
  - [ ]* 4.2 Написать property-based тест для Aside types
    - **Property 3: Aside type applies correct class**
    - **Validates: Requirements 3.1, 3.2, 3.3**
    - Проверять соответствие типа и CSS-класса

- [x] 5. Добавление стилей в ids.css
  - [x] 5.1 Добавить стили для Dialog и DialogLine
    - Отступы для контейнера диалога
    - Стили для реплик с hanging indent
    - _Requirements: 1.3, 1.4_
  - [x] 5.2 Добавить стили для Remark
    - Курсив, уменьшенный отступ
    - _Requirements: 2.2_
  - [x] 5.3 Добавить стили для типов Aside
    - Классы aside--warning, aside--tip
    - Использовать --ids__warning-RGB, --ids__success-RGB
    - _Requirements: 3.1, 3.2, 4.1_

- [x] 6. Final Checkpoint - Убедиться что все тесты проходят
  - Ensure all tests pass, ask the user if questions arise.
