# Playwright Login Tests

E2E test suite for a login page using Playwright + Page Object Model.

## Project Structure

```
playwright-login-tests/
├── pages/
│   └── LoginPage.js        # Page Object — all locators & actions
├── tests/
│   └── login.spec.js       # Test cases (15 tests, 6 categories)
├── playwright.config.js     # Playwright configuration
├── package.json
└── README.md
```

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Install browsers
npx playwright install
```

## Configuration

Open `playwright.config.js` and update:
- `baseURL` — point it to your app (default: `http://localhost:3000`)

Open `tests/login.spec.js` and update:
- `VALID_EMAIL` / `VALID_PASSWORD` — set to real test credentials

## Run Tests

```bash
npm test                # headless (CI-friendly)
npm run test:headed     # watch the browser
npm run test:ui         # interactive debug UI
```

## Test Categories

| #  | Category              | What it covers                                 |
|----|-----------------------|------------------------------------------------|
| 1  | Page Load             | Form renders, fields empty, links present      |
| 2  | Form Validation       | Empty submit, bad email, short password, clear  |
| 3  | Successful Login      | Success toast, redirect to /dashboard           |
| 4  | Failed Login          | Wrong creds, error toast, stays on login page   |
| 5  | Keyboard & A11y       | Enter key submit, tab order, input types        |
| 6  | Edge Cases            | Whitespace trim, special chars, double-click    |

## Why Page Object Model?

The `pages/LoginPage.js` file keeps all selectors in one place. When your
UI changes (a label renamed, a button moved), you update **one file** instead
of every test.
