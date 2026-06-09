// ============================================================
//  login.spec.js  —  Practice site: practicetestautomation.com
//
//  LEARNING GUIDE:
//  ─────────────────────────────────────────────────────────
//  test.describe()  →  groups related tests together
//  test()           →  one scenario / one test case
//  test.beforeEach  →  runs before EVERY test (setup)
//  expect()         →  assertion — checks the result
//
//  Run commands:
//    npx playwright test              ← headless (no browser window)
//    npx playwright test --headed     ← see the browser
//    npx playwright test --ui         ← visual test runner
// ============================================================

const { test, expect } = require("@playwright/test");
const { LoginPage } = require("../pages/LoginPage");

// ─── Test Data ───────────────────────────────────────────────
const VALID_USERNAME   = "student";
const VALID_PASSWORD   = "Password123";
const WRONG_PASSWORD   = "wrongpassword";
const WRONG_USERNAME   = "incorrectUser";

// ─── Setup: runs before each test ────────────────────────────
let loginPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  await loginPage.goto();           // navigate to login page
});

// ============================================================
// 1. PAGE LOAD TESTS
//    → Check the page loads correctly
// ============================================================
test.describe("Page Load", () => {

  test("username field is visible", async () => {
    // expect() is the assertion — toBeVisible() checks element appears on screen
    await expect(loginPage.usernameInput).toBeVisible();
  });

  test("password field is visible", async () => {
    await expect(loginPage.passwordInput).toBeVisible();
  });

  test("submit button is visible", async () => {
    await expect(loginPage.submitButton).toBeVisible();
  });

  test("fields are empty on page load", async () => {
    // toHaveValue("") checks the input has no pre-filled text
    await expect(loginPage.usernameInput).toHaveValue("");
    await expect(loginPage.passwordInput).toHaveValue("");
  });

});

// ============================================================
// 2. SUCCESSFUL LOGIN
//    → Valid credentials should take us to a success page
// ============================================================
test.describe("Successful Login", () => {

  test("login with valid credentials shows success page", async ({ page }) => {
    // ACTION: fill in the form and submit
    await loginPage.doLogin(VALID_USERNAME, VALID_PASSWORD);

    // ASSERTION 1: URL changes to the logged-in page
    await expect(page).toHaveURL(/.*logged-in-successfully/);

    // ASSERTION 2: Success heading appears
    await expect(loginPage.successHeading).toHaveText("Logged In Successfully");

    // ASSERTION 3: Logout button is visible
    await expect(loginPage.logoutButton).toBeVisible();
  });

});

// ============================================================
// 3. FAILED LOGIN
//    → Wrong credentials should show an error message
// ============================================================
test.describe("Failed Login", () => {

  test("wrong password shows error message", async () => {
    await loginPage.doLogin(VALID_USERNAME, WRONG_PASSWORD);

    // ASSERTION: error element is visible with correct text
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText("Your password is invalid!");
  });

  test("wrong username shows error message", async () => {
    await loginPage.doLogin(WRONG_USERNAME, VALID_PASSWORD);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText("Your username is invalid!");
  });

});

// ============================================================
// 4. EMPTY FORM SUBMISSION
//    → What happens when you click Submit without typing anything?
//    → LESSON: Testing that validation/errors appear
// ============================================================
test.describe("Empty Form", () => {

  test("submitting empty form shows username error", async () => {
    // We click Submit WITHOUT filling anything in
    await loginPage.clickSubmit();

    // The site shows "Your username is invalid!" even for empty input
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText("Your username is invalid!");
  });

  test("submitting with only password filled shows username error", async () => {
    // Fill password but leave username empty
    await loginPage.fillPassword(VALID_PASSWORD);
    await loginPage.clickSubmit();

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText("Your username is invalid!");
  });

});

// ============================================================
// 5. KEYBOARD NAVIGATION
//    → LESSON: Testing that keyboard/Tab works correctly
//    → Good for accessibility testing
// ============================================================
test.describe("Keyboard Navigation", () => {

  test("can tab from username to password field", async ({ page }) => {
    // Click username field to focus it
    await loginPage.usernameInput.click();
    await expect(loginPage.usernameInput).toBeFocused(); // confirms cursor is here

    // Press Tab — focus should move to password
    await page.keyboard.press("Tab");
    await expect(loginPage.passwordInput).toBeFocused(); // confirms focus moved
  });

  test("can submit form by pressing Enter on the submit button", async ({ page }) => {
    await loginPage.fillUsername(VALID_USERNAME);
    await loginPage.fillPassword(VALID_PASSWORD);

    // This site has no <form> tag — Enter on input fields won't submit.
    // Instead we focus the submit button and press Enter on it.
    await loginPage.submitButton.focus();
    await loginPage.submitButton.press("Enter");

    await expect(page).toHaveURL(/.*logged-in-successfully/);
  });

});

// ============================================================
// 6. FULL END-TO-END FLOW
//    → LESSON: Chain multiple steps — login THEN logout
//    → This is a real user journey test
// ============================================================
test.describe("End-to-End Flow", () => {

  test("user can login and then logout", async ({ page }) => {
    // STEP 1: Login
    await loginPage.doLogin(VALID_USERNAME, VALID_PASSWORD);
    await expect(page).toHaveURL(/.*logged-in-successfully/);
    await expect(loginPage.successHeading).toHaveText("Logged In Successfully");

    // STEP 2: Click Logout
    await loginPage.logoutButton.click();

    // STEP 3: Should be back on login page
    await expect(page).toHaveURL(/.*practice-test-login/);
    await expect(loginPage.usernameInput).toBeVisible();
  });

});

// ============================================================
// 7. FIELD ATTRIBUTES
//    → LESSON: Verify HTML attributes — important for accessibility
//      and security (password should be masked, not plain text)
// ============================================================
test.describe("Field Attributes", () => {

  test("password field masks input (type='password')", async () => {
    // toHaveAttribute checks an HTML attribute value
    await expect(loginPage.passwordInput).toHaveAttribute("type", "password");
  });

  test("username field is a text input (type='text')", async () => {
    await expect(loginPage.usernameInput).toHaveAttribute("type", "text");
  });

  test("submit button is enabled on page load", async () => {
    // toBeEnabled — button can be clicked (not disabled)
    await expect(loginPage.submitButton).toBeEnabled();
  });

});

// ============================================================
// 8. CASE SENSITIVITY
//    → LESSON: Credentials should be case-sensitive — uppercase
//      versions of valid creds must NOT log the user in
// ============================================================
test.describe("Case Sensitivity", () => {

  test("uppercase username is rejected", async () => {
    await loginPage.doLogin(VALID_USERNAME.toUpperCase(), VALID_PASSWORD);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText("Your username is invalid!");
  });

  test("uppercase password is rejected", async () => {
    await loginPage.doLogin(VALID_USERNAME, VALID_PASSWORD.toUpperCase());
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText("Your password is invalid!");
  });

});

// ============================================================
// 9. INPUT VALIDATION
//    → LESSON: Whitespace shouldn't sneak through — leading/trailing
//      spaces in credentials should fail authentication
// ============================================================
test.describe("Input Validation", () => {

  test("trailing whitespace in username is rejected", async () => {
    await loginPage.doLogin(VALID_USERNAME + " ", VALID_PASSWORD);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText("Your username is invalid!");
  });

  test("leading whitespace in username is rejected", async () => {
    await loginPage.doLogin(" " + VALID_USERNAME, VALID_PASSWORD);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText("Your username is invalid!");
  });

});

// ============================================================
// 10. RECOVERY FLOW
//    → LESSON: After a failed login, the user should still be able
//      to log in with correct credentials (no permanent block)
// ============================================================
test.describe("Recovery Flow", () => {

  test("user can retry with correct password after a failed attempt", async ({ page }) => {
    // STEP 1: Fail login first
    await loginPage.doLogin(VALID_USERNAME, WRONG_PASSWORD);
    await expect(loginPage.errorMessage).toContainText("Your password is invalid!");

    // STEP 2: Clear fields and retry with correct creds
    await loginPage.usernameInput.fill("");
    await loginPage.passwordInput.fill("");
    await loginPage.doLogin(VALID_USERNAME, VALID_PASSWORD);

    // STEP 3: Should succeed
    await expect(page).toHaveURL(/.*logged-in-successfully/);
    await expect(loginPage.successHeading).toHaveText("Logged In Successfully");
  });

});
