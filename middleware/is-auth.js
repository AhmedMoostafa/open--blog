const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const obj = jwt.verify(token, process.env.jwt);

    const user = await User.findOne({ _id: obj._id });

    if (!user) {
      throw new Error("not auth");
    }

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    next(e);
  }
};
module.exports = auth;
