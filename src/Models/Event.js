const { Schema, model } = require("mongoose");

const EventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
      default: [],
    },
    public_id: {
      type: Array,
      default: [],
    },
    lugar:{
      type: String,
      required: true,
    },
    dateEvent:{
     type: Date,
     required: true

    },
    hour:{
      type: String,
      required: true
    },
    checked: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Events", EventSchema);
