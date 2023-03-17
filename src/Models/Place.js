const { Schema, model } = require("mongoose");

const PlaceSchema = new Schema(
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
    parroquia: {
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

    contact: {
      type: String,
      default: "3836560",
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

module.exports = model("Places", PlaceSchema);
