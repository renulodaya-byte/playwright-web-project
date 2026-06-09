// ============================================================
//  login-scenarios.js — Data-driven failure scenarios
//
//  Each row is one test case the spec file loops over:
//    name      → human-readable test title
//    username  → value typed into username field
//    password  → value typed into password field
//    error     → expected substring of the error message
//
//  Adding a new failure case = adding ONE row here.
//  No new test code needed.
// ============================================================

const { VALID_USERNAME, VALID_PASSWORD } = require("./credentials");

const FAILED_LOGIN_SCENARIOS = [
  {
    name: "wrong password",
    username: VALID_USERNAME,
    password: "wrongpassword",
    error: "Your password is invalid!",
  },
  {
    name: "wrong username",
    username: "incorrectUser",
    password: VALID_PASSWORD,
    error: "Your username is invalid!",
  },
  {
    name: "uppercase username",
    username: VALID_USERNAME.toUpperCase(),
    password: VALID_PASSWORD,
    error: "Your username is invalid!",
  },
  {
    name: "uppercase password",
    username: VALID_USERNAME,
    password: VALID_PASSWORD.toUpperCase(),
    error: "Your password is invalid!",
  },
  {
    name: "trailing whitespace in username",
    username: VALID_USERNAME + " ",
    password: VALID_PASSWORD,
    error: "Your username is invalid!",
  },
  {
    name: "leading whitespace in username",
    username: " " + VALID_USERNAME,
    password: VALID_PASSWORD,
    error: "Your username is invalid!",
  },
  {
    name: "empty username with valid password",
    username: "",
    password: VALID_PASSWORD,
    error: "Your username is invalid!",
  },
];

module.exports = { FAILED_LOGIN_SCENARIOS };
