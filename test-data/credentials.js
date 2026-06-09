// ============================================================
//  credentials.js — Login credentials used across the test suite
//
//  Why a separate file?
//    → Single source of truth: change a value here, all tests update
//    → Easy to swap for environment variables later (CI, staging)
//    → Keeps test files focused on logic, not data
// ============================================================

const VALID_USERNAME = "student";
const VALID_PASSWORD = "Password123";

const WRONG_USERNAME = "incorrectUser";
const WRONG_PASSWORD = "wrongpassword";

module.exports = {
  VALID_USERNAME,
  VALID_PASSWORD,
  WRONG_USERNAME,
  WRONG_PASSWORD,
};
