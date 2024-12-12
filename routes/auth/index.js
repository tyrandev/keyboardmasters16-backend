const express = require("express");
const registerRoute = require("./register");
const loginRoute = require("./login");
const changePasswordRoute = require("./changePassword");
const accountRoute = require("./account");

const router = express.Router();

router.use(registerRoute);
router.use(loginRoute);
router.use(changePasswordRoute);
router.use(accountRoute);

module.exports = router;
