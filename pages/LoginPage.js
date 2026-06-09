// Page Object Model — encapsulates all login page locators & actions
// Usage: const login = new LoginPage(page); await login.doLogin(username, pw);

class LoginPage {
  constructor(page) {
    this.page = page;

    // --- Locators (HOW Playwright finds each element) ---
    this.usernameInput = page.locator("#username");       // finds by id
    this.passwordInput = page.locator("#password");       // finds by id
    this.submitButton  = page.locator("#submit");         // finds by id

    // After login — success page elements
    this.successHeading = page.locator("h1");             // page heading
    this.logoutButton   = page.locator(".wp-block-button__link"); // logout btn

    // After login — error message
    this.errorMessage = page.locator("#error");           // error text element
  }

  // --- Actions (WHAT we do on the page) ---

  async goto() {
    await this.page.goto("https://practicetestautomation.com/practice-test-login/");
  }

  async fillUsername(username) {
    await this.usernameInput.fill(username);
  }

  async fillPassword(password) {
    await this.passwordInput.fill(password);
  }

  async clickSubmit() {
    await this.submitButton.click();
  }

  async doLogin(username, password) {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickSubmit();
  }
}

module.exports = { LoginPage };
