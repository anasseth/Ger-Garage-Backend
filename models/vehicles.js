const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  name: String,
  manufacturer: String,
  type: String,
});

vehicleSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Vehicle", vehicleSchema);
