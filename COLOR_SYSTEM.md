# IDS Color System

## Overview

Semantic color tokens defined in `src/styles/colors.css`. All colors use RGB format for flexible opacity control via `rgba(var(--token), opacity)`.

## Core Tokens

| Token | RGB | Purpose |
|-------|-----|---------|
| `--ids__text-RGB` | 5, 5, 5 | Primary text |
| `--ids__link-RGB` | 0, 100, 240 | Links |
| `--ids__hover-RGB` | 0, 200, 0 | Hover states |
| `--ids__accent-RGB` | 253, 47, 75 | Accent/highlight |
| `--ids__code-RGB` | 115, 120, 125 | Code text |
| `--ids__mark-RGB` | 255, 225, 0 | Highlighted text |
| `--ids__surface-RGB` | 238, 240, 242 | Card backgrounds |
| `--ids__background-RGB` | 255, 255, 255 | Page background |

## Semantic Tokens

| Token | RGB | Purpose |
|-------|-----|---------|
| `--ids__success-RGB` | 34, 160, 80 | Positive status (free, no VPN, available) |
| `--ids__warning-RGB` | 200, 140, 0 | Caution status (VPN required, crypto) |
| `--ids__info-RGB` | 0, 120, 200 | Neutral info (Russian language, freemium) |

## Brand Tokens

| Token | RGB | Purpose |
|-------|-----|---------|
| `--ids__telegram-RGB` | 0, 136, 204 | Telegram brand color |

## Usage

### Basic
```css
color: rgb(var(--ids__text-RGB));
background: rgb(var(--ids__surface-RGB));
```

### With Opacity
```css
background: rgba(var(--ids__success-RGB), 0.15);
color: rgb(var(--ids__success-RGB));
```

### Badges

Use semantic tokens for status badges:

```css
/* Positive: free, no VPN, accepts Russian cards */
.badge--positive {
  background: rgba(var(--ids__success-RGB), 0.15);
  color: rgb(var(--ids__success-RGB));
}

/* Warning: VPN required, crypto payment */
.badge--warning {
  background: rgba(var(--ids__warning-RGB), 0.15);
  color: rgb(var(--ids__warning-RGB));
}

/* Info: Russian language, freemium, SBP */
.badge--info {
  background: rgba(var(--ids__info-RGB), 0.15);
  color: rgb(var(--ids__info-RGB));
}
```

### Buttons

```css
.button-primary {
  background: rgb(var(--ids__text-RGB));
  color: rgb(var(--ids__background-RGB));
}

.button-primary:hover {
  background: transparent;
  color: rgb(var(--ids__text-RGB));
}
```

### Links

```css
a {
  color: rgb(var(--ids__link-RGB));
}

a:hover {
  color: rgb(var(--ids__hover-RGB));
}
```

## Rules

1. **Never use hardcoded colors** — always use CSS variables
2. **No dark mode overrides for semantic tokens** — they work in both themes
3. **Use semantic tokens for status** — success/warning/info for badges
4. **Brand colors are exceptions** — Telegram blue is acceptable as a token

## Component Reference

| Component | Tokens Used |
|-----------|-------------|
| AccessBadges | success, warning, info |
| PaymentBadges | success, warning, info |
| ComparisonTable | success, warning, info |
| TelegramGuide | telegram |
| Button | text, background |
| Links | link, hover |
