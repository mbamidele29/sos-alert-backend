const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("authorization");

    if (!token || !token.includes(" "))
      throw new Error("invalid authorization token");

    const decoded = await jwt.verify(token.split(" ")[1], process.env.JWT_KEY);
    const user = await User.findById(decoded["_id"]);
    if (!user) throw new Error("user does not exist");
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;
