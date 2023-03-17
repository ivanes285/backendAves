const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    
    role: {
      type: String,
      enum: ["gestor", "admin"],
      default: "gestor",
    },

    status: {
      type: Boolean,
      default: 1,
    },
    
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Users", UserSchema);
