const { body } = require("express-validator");
const User = require("../models/user");
const path = require("path");
const Postschema = [
  body("title").trim().isLength({ min: 5 }),
  body("content").trim().isLength({ min: 5 }),
  /*   body("image").exists({ checkFalsy: true }),
   */
];

const signup = [
  body("email")
    .isEmail()
    .withMessage("please enter your valid email ")
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((userDoc) => {
        if (userDoc) {
          return Promise.reject("Email already exists");
        }
      });
    }),

  body("password").trim().isLength({ min: 5 }),
  body("name").exists({ checkFalsy: true }).trim(),
];
exports.validateFile = (req, res, next) => {
  if (!req.file) {
    const error = new Error("No Image  Provided");
    error.statusCode = 422;
    next(error);
  }
  req.file.path =
    "images/" + req.file.path.replace(/\\/g, "/").substring("public".length);
  next();
};

const login = [
  body("email").isEmail().withMessage("please enter your valid email "),
  body("password").trim().isLength({ min: 5 }),
];
const status = [body("status").trim().not().isEmpty()];
exports.signupValidation = signup;
exports.loginValidation = login;

exports.postValidation = Postschema;
exports.status = status;
