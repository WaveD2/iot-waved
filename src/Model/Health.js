const { Schema } = require("mongoose");
const mongoose = require("mongoose");

//nhip tim
const HealthSchema = new mongoose.Schema(
  {
    //user
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    // nhip tim
    heartRate: {
      type: Number,
      required: true
    },
  },
  {
    timestamps: true,
  }
);
const HealthModel = mongoose.model("Health", HealthSchema);


//nhiet do
const TemperatureSchema = new mongoose.Schema(
  {
    //user
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    temperature: {
      type: Number,
      required: true
    },
  },
  {
    timestamps: true,
  }
);
const TemperatureModel = mongoose.model("Temperature", TemperatureSchema);

module.exports = {
  HealthModel,
  TemperatureModel
};