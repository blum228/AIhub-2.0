# Implementation Plan

- [x] 1. Update colors.css with semantic tokens
  - Add `--ids__success-RGB: 34, 160, 80` for positive statuses
  - Add `--ids__warning-RGB: 200, 140, 0` for limitations/cautions
  - Add `--ids__info-RGB: 0, 120, 200` for neutral information
  - Keep existing tokens unchanged for backward compatibility
  - _Requirements: 1.1, 2.1_

- [x] 1.1 Write property test for token definitions
  - **Property 1: All semantic tokens defined in colors.css**
  - **Validates: Requirements 1.1, 2.1**

- [x] 2. Refactor AccessBadges.astro to use semantic tokens
  - Replace `rgba(0, 180, 0, 0.15)` with `rgba(var(--ids__success-RGB), 0.15)`
  - Replace `rgb(0, 140, 0)` with `rgb(var(--ids__success-RGB))`
  - Replace `rgba(255, 180, 0, 0.15)` with `rgba(var(--ids__warning-RGB), 0.15)`
  - Replace `rgb(180, 120, 0)` with `rgb(var(--ids__warning-RGB))`
  - Replace `rgba(0, 100, 200, 0.15)` with `rgba(var(--ids__info-RGB), 0.15)`
  - Replace `rgb(0, 80, 160)` with `rgb(var(--ids__info-RGB))`
  - Remove dark mode overrides (will use same tokens)
  - _Requirements: 2.2, 2.3, 2.4, 3.1_

- [x] 3. Refactor PaymentBadges.astro to use semantic tokens
  - Replace hardcoded colors with semantic tokens following same pattern as AccessBadges
  - free badge → success token
  - russian-cards badge → success token
  - crypto badge → warning token
  - sbp badge → info token
  - Remove dark mode overrides
  - _Requirements: 2.2, 2.3, 2.4, 3.2_

- [x] 3.1 Write property test for badge semantic tokens
  - **Property 3: Badges use correct semantic tokens**
  - **Validates: Requirements 2.2, 2.3, 2.4, 3.1, 3.2**

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Scan and refactor remaining components with hardcoded colors
  - Search all .astro files for hardcoded rgb(), rgba(), hex colors
  - Refactor each occurrence to use appropriate IDS token
  - Document any exceptions (third-party requirements)
  - _Requirements: 1.2, 1.4, 5.3_

- [x] 5.1 Write property test for no hardcoded colors
  - **Property 2: No hardcoded color values in components**
  - **Validates: Requirements 1.2, 1.4, 5.3**

- [x] 5.2 Write property test for hover states
  - **Property 4: Hover states use hover token**
  - **Validates: Requirements 2.5, 3.3**

- [x] 6. Update COLOR_SYSTEM.md documentation
  - Update token list to match actual colors.css definitions
  - Add clear guidance for badge color selection
  - Add examples for each component type (badges, buttons, links, text)
  - Remove references to non-existent tokens
  - _Requirements: 6.1, 6.2, 6.3_

- [x] 6.1 Write property test for documentation sync
  - **Property 5: Documentation matches implementation**
  - **Validates: Requirements 6.1**

- [x] 7. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
