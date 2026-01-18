# AGENTS.md - Development Guide for Accounting Essentials Web Textbook

This guide is for AI agents working on this interactive accounting learning platform.

## Project Overview

A static web-based accounting textbook built with pure HTML, CSS, and JavaScript. No build tools, no frameworks, no test suite.

**Tech Stack:**
- HTML5 (semantic markup)
- CSS3 (custom properties, Grid, Flexbox, animations)
- Vanilla JavaScript (ES6+, class-based architecture)
- Inter font family via Google Fonts

**Structure:**
```
/
├── index.html                 # Landing page
├── template.html             # Use this as starting point for new modules
├── styles.css                # All CSS in one file (CSS custom properties)
├── components.js             # Shared interactive logic
├── Part1/                    # Foundations of Accounting
├── part2/                    # Merchandising & Inventory
└── part3/                    # Systems & Internal Controls
```

## Build/Development Commands

**No build process exists.** This is a static site that works directly in the browser.

**Opening locally:**
- Use any static server: `python -m http.server 8000` or `npx serve`
- Or open HTML files directly in browser (relative links work)

**Testing:**
- No automated tests. Manual browser testing required.
- Test in multiple browsers (Chrome, Firefox, Safari)
- Test mobile responsiveness (use DevTools device emulation)

**Linting:**
- No linter configured. Follow patterns documented below.

## File Naming Conventions

**CRITICAL: Maintain consistency.**

**Directories:**
- Use `part1/`, `part2/`, `part3/` (lowercase preferred)
- Inside parts: `chapter1/`, `chapter2/`, ... `chapter8/`

**Chapter landing pages:**
- `ch01.html`, `ch02.html`, ... (pad with zero)

**Module files:**
- Concepts: `ch01_C1.html`, `ch01_C2.html` (C = Concept)
- Analysis: `ch01_A1.html`, `ch01_A2.html` (A = Analysis)
- Procedures: `ch01_P1.html`, `ch01_P2.html`, ... (P = Procedure)
- Practice: `ch01_PRACTICE.html` (all caps, no number)

**Navigation paths:**
- From chapter: `../part1.html`
- From module: `../ch01.html`
- From root: `index.html`, `part1/part1.html`

## Code Style Guidelines

### HTML Structure

**Use template.html as starting point.**

**Document structure:**
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Page Title] | ACCOUNTING ESSENTIALS</title>
    <link rel="stylesheet" href="../../styles.css">
</head>

<body>
    <header>...</header>
    <main class="container">
        <div class="breadcrumbs">...</div>
        <article class="animate-fade-in">
            <h1 style="border-left: 8px solid var(--primary); padding-left: 1rem; margin: 2rem 0;">...</h1>
            <section class="interactive-section">...</section>
        </article>
    </main>
    <script src="../../components.js"></script>
</body>

</html>
```

**Use semantic HTML:**
- `<header>` for navigation
- `<main>` for primary content
- `<article>` for self-contained content modules
- `<section>` for thematic grouping
- `<footer>` for footer content

### CSS Styling

**Use CSS custom properties (defined in styles.css):**

```css
/* Colors */
--primary: #1a237e;           /* Deep Navy */
--secondary: #c5a059;         /* Muted Gold */
--success: #27ae60;           /* Green */
--error: #e74c3c;             /* Red */
--warning: #f1c40f;          /* Yellow */
--info: #3498db;              /* Blue */

/* Light/Dark variants */
--primary-light, --primary-dark
--secondary-light, --secondary-dark
--success-light, --success-dark
--error-light, --error-dark
--warning-light, --warning-dark
--info-light, --info-dark

/* Typography */
--text-main: #2c3e50;
--text-muted: #7f8c8d;
--white: #ffffff;

/* Spacing */
--container-width: 1200px;
--radius-sm: 8px;
--radius-md: 15px;
--radius-lg: 25px;
```

**Common classes:**
```html
<!-- Layout -->
<div class="container">...</div>
<div class="card-grid">...</div>

<!-- Cards -->
<a href="#" class="content-card">
    <div class="chapter-badge">CONCEPT C1</div>
    <h3>Title</h3>
    <p>Description</p>
</a>

<!-- Interactive Sections -->
<section class="interactive-section">
    <h2>Section Title</h2>
    <p>Content here...</p>
</section>

<!-- Flip Cards -->
<div class="flip-card-container">
    <div class="flip-card">
        <div class="flip-card-front">...</div>
        <div class="flip-card-back">...</div>
    </div>
</div>

<!-- Tables -->
<div class="table-scroll">
    <table class="financial-table">...</table>
</div>

<!-- Buttons -->
<button class="btn btn-primary">Action</button>
<button class="btn btn-outline">Secondary</button>

<!-- Feedback -->
<div class="feedback correct">...</div>
<div class="feedback incorrect">...</div>
```

**DO NOT use inline styles for color, spacing, borders, etc. Use CSS classes and variables.**
Inline styles are acceptable for one-off layout tweaks (margin/padding).

### JavaScript Conventions

**Use the InteractiveSystem class in components.js for reusable logic:**

```javascript
// In components.js
class InteractiveSystem {
    init() {
        this.bindFlipCards();
        this.bindQuizzes();
        this.bindCalculators();
        this.bindFormValidators();
    }

    bindFlipCards() {
        document.querySelectorAll('.flip-card').forEach(card => {
            card.addEventListener('click', () => {
                card.classList.toggle('flipped');
            });
        });
    }

    // ... other methods
}

document.addEventListener('DOMContentLoaded', () => {
    const system = new InteractiveSystem();
    system.init();
});
```

**For module-specific JavaScript, write inline scripts in HTML:**

```html
<script src="../../components.js"></script>
<script>
    // Module-specific logic here
    function checkAnswer() {
        // Validation logic
    }

    function calculateResult() {
        // Calculation logic
    }
</script>
```

**Naming conventions:**
- Functions: `camelCase` - `checkJournalEntry()`, `calculateROA()`
- Variables: `camelCase` - `totalAssets`, `isCorrect`
- Constants: `UPPER_SNAKE_CASE` - `correctAnswers`, `jeScenarios`
- Classes: `PascalCase` - `InteractiveSystem`
- IDs/Classes: `kebab-case` - `final-assets`, `je-account1`

### Interactive Component Patterns

**Quiz Components:**
```html
<div class="quiz-container" data-explanation="Explanation text">
    <label><input type="radio" name="q1" data-correct="true"> Option A</label>
    <label><input type="radio" name="q1" data-correct="false"> Option B</label>
    <button class="quiz-submit btn btn-primary">Check Answer</button>
    <div class="feedback"></div>
</div>
```

**Form Validators:**
```html
<form class="exercise-form" data-success-text="Success message">
    <input type="text" data-answer="correct answer">
    <button type="submit" class="btn btn-primary">Submit</button>
    <div class="feedback"></div>
</form>
```

**Calculator Components:**
```html
<div id="roa-calculator">
    <input type="number" id="roa-income">
    <input type="number" id="roa-assets">
    <div id="roa-result">0.00%</div>
</div>
```

### Error Handling

**Always validate user input:**
```javascript
function validateInput(input) {
    if (!input.value) {
        showFeedback("Please enter a value", "incorrect");
        return false;
    }
    const num = parseFloat(input.value);
    if (isNaN(num)) {
        showFeedback("Please enter a valid number", "incorrect");
        return false;
    }
    return true;
}
```

**Use floating-point tolerance for number comparisons:**
```javascript
const EPSILON = 0.01;
if (Math.abs(actual - expected) < EPSILON) {
    // Values are "equal"
}
```

### Accessibility

- Use semantic HTML (`<nav>`, `<main>`, `<article>`, `<section>`)
- Include `aria-label` where appropriate
- Ensure color contrast is sufficient (use CSS variables)
- Test keyboard navigation
- Add `alt` text to images

### Mobile Responsiveness

- Use CSS Grid with `repeat(auto-fill, minmax(300px, 1fr))` for responsive grids
- Test on mobile breakpoints (max-width: 768px)
- Ensure buttons and inputs are touch-friendly (minimum 44px height)
- Use `window.innerWidth < 768` checks for mobile-specific behavior

## When Adding New Content

1. Use `template.html` as starting point
2. Follow file naming conventions exactly
3. Update navigation links in parent pages
4. Add breadcrumbs for context
5. Include proper `<title>` tags
6. Test all interactive components
7. Verify links work from multiple entry points
8. Check mobile responsiveness

## Common Pitfalls

- **DO NOT** use inline styles for colors, use CSS variables
- **DO NOT** use `alert()` for feedback, use `.feedback` elements
- **DO NOT** hardcode colors, use `var(--primary)`, `var(--success)`, etc.
- **DO NOT** break the directory structure
- **DO NOT** modify `styles.css` unless adding a new reusable class
- **DO** test in multiple browsers
- **DO** verify relative link paths (they're different from root vs subdirectory)
- **DO** maintain the color palette consistency

## Pedagogical Approach

This is an educational platform. When creating interactive exercises:
- Provide clear, step-by-step instructions
- Give instant, constructive feedback
- Show correct answers after multiple attempts
- Include "professional tips" and analogies (see ch02_P1.html examples)
- Use real-world accounting scenarios (company names, realistic transactions)
- Balance difficulty: start simple, progress to complex

## File Organization Summary

```
styles.css           # Edit only for new reusable classes
components.js        # Edit only for new shared interactive logic
template.html        # Use as template for new modules
Part1/part1.html     # Part overview (grid of modules)
Part1/chapter1/      # Chapter files
  ├─ ch01.html       # Chapter landing page
  ├─ ch01_C1.html    # Concept 1
  ├─ ch01_A1.html    # Analysis 1
  ├─ ch01_P1.html    # Procedure 1
  ├─ ch01_PRACTICE.html  # Practice case
  └─ (additional modules...)
```

No AGENTS.md existed previously - this is the initial version.
