const validator = require("validator");
const { Schema, model } = require("mongoose");

// email emailAddress or phoneNumber is required
const schema = Schema(
  {
    firstName: {
      type: String,
      required: [true, "first name is required"],
      validate(value) {
        if (value.length < 3)
          throw new Error("first name must have a minimum of 3 characters");
      },
    },
    emailAddress: {
      type: String,
      required: [true, "email address is required"],
      validate(value) {
        if (!validator.isEmail(value))
          throw new Error("email address is not valid");
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
    isPrimary: {
      type: Boolean,
      default: false,
    },
    userId: {
      ref: "Users",
      required: true,
      type: Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

module.exports = model("Contacts", schema);
