const express = require("express");
const registerRoute = require("./register");
const loginRoute = require("./login");
const changePasswordRoute = require("./changePassword");
const accountRoute = require("./account");

const router = express.Router();

router.use(registerRoute); // Register route for /register
router.use(loginRoute); // Login route for /login
router.use(changePasswordRoute); // Change password route for /change-password
router.use(accountRoute); // Account route for /account

module.exports = router;
