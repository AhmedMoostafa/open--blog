const express = require("express");
const router = express.Router();
const {
  signupValidation,
  loginValidation,
  status,
} = require("../middleware/validation");
const isAuth = require("../middleware/is-auth");
const authController = require("../controllers/auth");
router.post("/signup", signupValidation, authController.signup);
router.post("/login", loginValidation, authController.login);
router.get("/status", isAuth, authController.getUserStatus);
router.patch("/status", isAuth, status, authController.updateUserStatus);

module.exports = router;
