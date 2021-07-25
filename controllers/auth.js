const User = require("../models/user");
const { validationResult } = require("express-validator");
exports.signup = async (req, res, next) => {
  const errors = await validationResult(req);
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  try {
    if (!errors.isEmpty()) {
      const error = new Error("validation faild");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const user = new User({
      email,
      password,
      name,
    });
    await user.save();
    res.status(201).json({ message: "user created", user });
  } catch (e) {
    next(e);
  }
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findByCredentials(email, password);
    const jwt = await user.generateToken();
    res.json({ token: jwt, userId: user._id.toString() });
  } catch (e) {
    next(e);
  }
};

exports.getUserStatus = async (req, res, next) => {
  try {
    const user = req.user;
    res.status(200).json({ status: user.status });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateUserStatus = async (req, res, next) => {
  const newStatus = req.body.status;
  const user = req.user;
  try {
    user.status = newStatus;
    await user.save();
    res.status(200).json({ message: "User updated." });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
