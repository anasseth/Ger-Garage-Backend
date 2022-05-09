/*
Refer General Guide.txt for undetsandong base architecture
*/
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  company_name: String,
  model: String,
  original_price: String,
  discounted_price: String,
  desc: String,
  category: String,
  orderDate: String,
  qty: String,
  firstName: String,
  lastName: String,
  address: String,
  email: String,
  phoneNumber: String,
  paypal: Boolean,
  stripe: Boolean,
  creditCard: Boolean,
  creditCardNumber: String,
  status: String,
  registeredUserData: {
    name: String,
    email: String,
  },
});

orderSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Order", orderSchema);
