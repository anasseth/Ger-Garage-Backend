const mongoose = require("mongoose");

const mechanicSchema = new mongoose.Schema({
  name: String,
  experienceLevel: String,
  servicePerDay: String,
});

mechanicSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Mechanic", mechanicSchema);
