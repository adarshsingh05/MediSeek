const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema({
  email: String,
  name: String,
  address: String,
  location: {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
});

hospitalSchema.index({ location: "2dsphere" }); // Enable geospatial queries

const Hospital = mongoose.model("Hospital", hospitalSchema);
module.exports = Hospital;
