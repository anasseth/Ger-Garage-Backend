/*
Refer General Guide.txt for undetsandong base architecture
*/
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  company_name: String,
  model: String,
  category: String,
  original_price: String,
  discounted_price: String,
  feature: [],
  imageURL: String,
  reviews: [
    {
      username: String,
      message: String,
      rating: String,
      email: String,
    },
  ],
});

productSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Product", productSchema);
