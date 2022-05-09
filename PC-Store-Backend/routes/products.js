/*
Product Route.
This Route is used to handle New Product Creation and Product Review Update
first we import express and then use router function from it
then importing the model function.
Request Logger function print the type of request and request body in console 
*/
const express = require("express");
var router = express.Router();
const Product = require("../models/product");
router.use(express.static("build"));

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

router.use(requestLogger);

/*
GET PRODUCT API
Getting All Product Data from Database 
*/
router.get("/", (request, response) => {
  Product.find({}).then((products) => {
    response.json(products);
  });
});

/*
POST API
Product information is received in the request body
we create a new product object and add up properties from 
body. after that we save the product object in database
*/
router.post("/", (request, response) => {
  const body = request.body;
  if (body.company_name === undefined || body.original_price === undefined) {
    return response.status(400).json({ error: "Name or Price is Missing" });
  }
  var product = new Product({
    company_name: body.company_name,
    model: body.model,
    category:body.category,
    original_price: body.original_price,
    discounted_price: body.discounted_price,
    feature: body.feature,
    imageURL: body.imageURL,
    reviews: body.reviews,
  });
  product.save().then((savedProduct) => {
    response.json(savedProduct);
  });
});

/*
GET BY ID
This API is not needed as we are not using in frontend 
*/
router.get("/:id", (request, response, next) => {
  Product.findById(request.params.id)
    .then((product) => {
      if (product) {
        response.json(product);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      console.log("WAT IS THIS");
      next(error);
    });
});

/*
DELETE API
API is not used in our App as we don;t have product deletion feature
it works based on the id received in the parameter.
findByIdAndRemove method is used to remove product by id
*/
router.delete("/:id", (request, response, next) => {
  Product.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

/*
PUT API. 
This only hanlde reviews update
you receive the id in the parameter and reviews array in the body.
Product object is filteredbased on id and then reviews array is replaced with the update 
one
*/
router.put("/reviews/:id", (request, response, next) => {
  const body = request.body;

  const product = {
    reviews: body.reviews,
  };

  Product.findByIdAndUpdate(request.params.id, product, { new: true })
    .then((updatedProduct) => {
      response.json(updatedProduct);
    })
    .catch((error) => next(error));
});

module.exports = router;
