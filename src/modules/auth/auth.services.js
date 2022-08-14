const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/user.model");
const { successResponse } = require("../../utils/response");

const actionLogin = async (req, res, next) => {
  try {
    const { emailAddress, password } = req.body;

    if (!emailAddress || !password)
      throw new Error("email address and password required");

    const user = await User.findOne({ emailAddress });
    if (!user) throw new Error("invalid credentials");
    console.log(user.password);

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("invalid credentials");

    const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);
    res.send(successResponse("registered successfully", { user, token }));
  } catch (error) {
    next(error);
  }
};

const actionRegister = async (req, res, next) => {
  try {
    const { firstName, emailAddress, phoneNumber, password } = req.body;
    const user = User({ firstName, emailAddress, phoneNumber, password });

    await user.save();
    const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);

    res.send(successResponse("registered successfully", { user, token }));
  } catch (error) {
    next(error);
  }
};

const actionChangePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword)
      throw new Error("all fields required");

    if (oldPassword === newPassword)
      throw new Error("new password cannot be equal to old password");
    if (newPassword !== confirmPassword)
      throw new Error("new password and confirm password do not match");

    const validOldPassword = await bcrypt.compare(
      oldPassword,
      req.user.password
    );
    if (!validOldPassword) throw new Error("invalid old password");

    req.user.password = newPassword;
    await req.user.save();

    res.send(successResponse("password updated successfully", req.user));
  } catch (error) {
    next(error);
  }
};

const actionProfile = (req, res, next) => {
  try {
    res.send(successResponse("successful", req.user));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  actionLogin,
  actionProfile,
  actionRegister,
  actionChangePassword,
};
