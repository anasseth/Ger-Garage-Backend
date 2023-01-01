const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  licenseNumber: String,
  initialCost: String,
  customerNotes: String,
  category: String,
  bookingDate: String,
  bookingStatus: String,
  mechanicAssigned: String,
  userDetail: {
    firstName: String,
    lastName: String,
    address: String,
    email: String,
    phoneNumber: String,
  },
  vehicleDetail: {
    make: String,
    model: String,
    engineType: String,
    engineSize: String,
  },
  paymentDetail: {
    paypal: Boolean,
    stripe: Boolean,
    creditCard: Boolean,
    creditCardNumber: String,
  },
  registeredUserData: {
    name: String,
    email: String,
  },
});

bookingSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
