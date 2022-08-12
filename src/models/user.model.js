const bcrypt = require("bcrypt");
const validator = require("validator");
const { Schema, model } = require("mongoose");

const schema = Schema(
  {
    firstName: {
      type: String,
      required: [true, "firstname is required"],
      validate(value) {
        if (value.length < 3) throw new Error("minimum length of 4 characters");
      },
    },
    emailAddress: {
      type: String,
      required: [true, "email address is required"],
      index: {
        unique: true,
        dropDups: true,
      },
      validate(value) {
        if (!validator.isEmail(value)) throw new Error("Invalid email address");
      },
    },
    password: {
      type: String,
      required: [true, "password is required"],
      validate(value) {
        if (value.length < 8) throw new Error("minimum length of 8 characters");
      },
    },
    phoneNumber: {
      type: String,
      required: [true, "phone number is required"],
      validate(value) {
        if (!validator.isMobilePhone(value, ["en-NG"]))
          throw new Error("invalid phone number");
      },
    },
  },
  {
    timestamps: true,
  }
);

schema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

schema.methods.toJSON = function () {
  const userObj = this.toObject();

  delete userObj.password;
  return userObj;
};

module.exports = model("Users", schema);
