const { Schema, model } = require("mongoose");

const BirdSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
    },
    localname: {
      type: String,
      required: true,
    },
    measure: {
      type: String,
      required: true,
    },
    song: {
      type: String,
      required: true,
    },
    observation: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
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

    lat: { type: String,
      default: "0.04777"
     },

    lng: { type: String,
      default: "-78.22168"
     },
    zoom: { type: String,
       default: "12"
       },
    putuacion: {
      type: Number,
    },
    checked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


module.exports = model("Birds", BirdSchema);
