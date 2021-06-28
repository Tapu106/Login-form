const express = require("express");
const router = express.Router();
const { check, body } = require("express-validator/check");
const User = require("../model/user");

const authController = require("../controller/auth");

router.get("/", authController.getLogin);

router.get("/login", authController.getLogin);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "E-Mail exists already, please pick a different one."
            );
          }
        });
      })
      .normalizeEmail(),
    body("confirmPass")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.pass) {
          throw new Error("Passwords have to match!");
        }
        return true;
      }),
  ],
  authController.postSignup
);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address.")
      .normalizeEmail(),
  ],
  authController.postLogin
);

router.get("/logout", authController.postLogout);

module.exports = router;
