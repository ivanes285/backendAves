const { Schema, model } = require("mongoose");

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  {
      timestamps: true,
      versionKey:false
  }
);



module.exports = model("Categories", CategorySchema);
