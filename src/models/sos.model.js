const { Schema, model } = require("mongoose");

const schema = Schema(
  {
    title: {
      type: String,
      required: [true, 'SOS title is required'],
    },
    description: {
      type: String,
    },
    attachments: {
      type: [String],
    },
    contacted: {
      type: [
        {
          contact: {
            required: true,
            ref: "Contacts",
            type: Schema.Types.ObjectId,
          },
          acknowledged: {
            type: Boolean,
            default: false,
          },
        },
      ],
    },
    priority: {
      type: String,
      default: "MEDIUM",
      enum: ["LOW", "MEDIUM", "HIGH"],
    },
    resolved: {
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

module.exports = model("SOS", schema);
