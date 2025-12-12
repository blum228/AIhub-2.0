# Implementation Plan

- [x] 1. Create CategoryHero component
  - [x] 1.1 Create CategoryHero.astro component with props interface
    - Create file at `src/components/catalog/CategoryHero.astro`
    - Define Props interface: icon, title, description, toolCount
    - Implement semantic HTML structure with header element
    - _Requirements: 1.1, 1.2, 1.3, 6.3_
  - [x] 1.2 Style CategoryHero with magazine typography
    - Large editorial title (3.6em, weight 700)
    - Icon above title (4em)
    - Description with 1.2em, line-height 1.5, opacity 0.8
    - Pill-badge for tool count using IDS surface color
    - Generous padding (3em vertical)
    - Use IDS CSS variables throughout
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 7.1, 7.2, 7.3_
  - [x]* 1.3 Write property test for CategoryHero
    - **Property 1: Hero section displays category data correctly**
    - **Validates: Requirements 1.1, 1.2, 1.3**

- [x] 2. Update category page layout
  - [x] 2.1 Refactor [slug].astro to use CategoryHero
    - Import and use new CategoryHero component
    - Replace existing category-header markup
    - Add proper Space components between sections (M, L, XL)
    - _Requirements: 1.1, 1.4_
  - [x] 2.2 Update main content structure
    - Wrap main content in semantic main element
    - Ensure ToolGrid uses columns="M"
    - Add Space size="XL" between major sections
    - _Requirements: 2.1, 6.3_
  - [x] 2.3 Update editorial content section
    - Ensure TextWidth wraps Content
    - Add 'ids' class to content section for typography
    - _Requirements: 4.1, 4.2_
  - [x]* 2.4 Write property test for tool grid rendering
    - **Property 2: All collection tools are rendered in the grid**
    - **Validates: Requirements 2.1, 2.2**

- [x] 3. Update comparison table integration
  - [x] 3.1 Verify ComparisonTable conditional rendering
    - Ensure table only shows when filteredTools.length > 1
    - Add proper spacing around table
    - _Requirements: 3.1, 3.2, 3.3_
  - [x]* 3.2 Write property test for comparison table
    - **Property 3: Comparison table conditional rendering**
    - **Validates: Requirements 3.1**

- [x] 4. Update related categories section
  - [x] 4.1 Restyle related categories as clean grid
    - Update sidebar-categories class to related-categories
    - Use consistent grid layout with CategoryCard
    - Add subtle section title styling
    - _Requirements: 5.1, 5.2_
  - [x]* 4.2 Write property test for related categories
    - **Property 5: Other categories exclude current category**
    - **Validates: Requirements 5.1**

- [x] 5. Verify SEO and structured data
  - [x] 5.1 Verify Schema.org CollectionPage data
    - Ensure JSON-LD contains correct category data
    - Verify itemListElement contains all tools
    - _Requirements: 6.1_
  - [x] 5.2 Verify breadcrumb navigation
    - Ensure Breadcrumbs component receives correct items
    - Verify catalog link and current category name
    - _Requirements: 6.2_
  - [x]* 5.3 Write property tests for SEO
    - **Property 6: Schema.org structured data is valid**
    - **Property 7: Breadcrumbs contain correct navigation path**
    - **Validates: Requirements 6.1, 6.2**

- [x] 6. CSS cleanup and IDS compliance
  - [x] 6.1 Audit and update CSS to use IDS tokens
    - Replace any hardcoded colors with IDS variables
    - Use --ids__density for spacing calculations
    - Use --ids__radius for border-radius
    - _Requirements: 7.1, 7.2, 7.3_
  - [x]* 6.2 Write property test for CSS compliance
    - **Property 8: CSS uses IDS design tokens**
    - **Validates: Requirements 7.1, 7.2, 7.3**
    - Note: Existing cssVariables.property.test.ts covers this

- [x] 7. Checkpoint - Ensure all tests pass
  - All new category page tests pass (11/11)

- [x] 8. Final polish and mobile responsiveness
  - [x] 8.1 Add responsive styles for mobile
    - Adjust hero typography for smaller screens
    - Ensure grid adapts to single/two columns
    - Test on various viewport sizes
    - _Requirements: 2.4_
  - [x] 8.2 Final visual review
    - Check whitespace and visual rhythm
    - Verify magazine aesthetic is achieved
    - _Requirements: 1.4, 2.3_

- [x] 9. Final Checkpoint - Ensure all tests pass
  - All tests pass, implementation complete.
