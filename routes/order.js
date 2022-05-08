/*
Order Route.
This Route is used to handle New Order Creation and Order Status Update
first we import express and then use router function from it
then importing the model function.
Request Logger function print the type of request and request body in console 
*/
const express = require("express");
var router = express.Router();
const transporter = require("../email/email");
const Order = require("../models/order");
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
GET ORDER API
Getting All order data from database 
*/
router.get("/", (request, response) => {
  Order.find({}).then((order) => {
    response.json(order);
  });
});

/*
POST API
This API is used to create new order.
we create a new order object and add properties
from request body. We then create a message body for our email.
You may change the message body according to you requirement

then save function is called. if saved successfully , we call transporter
function from email.js file and if there is error the error is returned
*/
router.post("/", (request, response) => {
  const body = request.body;
  console.log(request.body);
  if (body.company_name == undefined) {
    return response.status(400).json({ error: "content missing" });
  }
  const order = new Order({
    company_name: body.company_name,
    model: body.model,
    original_price: body.original_price,
    discounted_price: body.discounted_price,
    desc: body.desc,
    category:body.category,
    qty: body.qty,
    orderDate: body.orderDate,
    firstName: body.firstName,
    lastName: body.lastName,
    address: body.address,
    email: body.email,
    phoneNumber: body.phoneNumber,
    email: body.email,
    paypal: body.paypal,
    stripe:body.stripe,
    creditCard: body.creditCard,
    creditCardNumber: body.creditCardNumber,
    status: body.status,
    registeredUserData: {
      name: body.username,
      email: body.email,
    },
  });

  var message = {
    from: "marina.spot.booking@gmail.com",
    to: order.email,
    subject: "Order Confirmation | DigitalRebuild.io",
    text: `
    Hello ${order.firstName},

    Your Order for ${order.company_name} ${order.model} has been confirmed. 

    Booking Details

    Name :${order.company_name} ${order.model}
    Quantity : ${order.qty} PCS
    Original Price : ${order.original_price}
    Discounted Price : ${order.discounted_price}

    Best Regards,
    DigitalRebuild.io`,
  };

  console.log(body);
  console.log(order);

  order
    .save()
    .then((savedOrder) => {
      response.json(savedOrder);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      // transporter.sendMail(message, function (err, info) {
      //   if (err) {
      //     console.log(err);
      //   } else {
      //     console.log(info);
      //   }
      // });
    });
});

/*
GET ORDER BY ID.
order id is received through the parameter and then specific order object is returned
This API is not used in our application so you may remove it
*/
router.get("/:id", (request, response, next) => {
  Order.findById(request.params.id)
    .then((order) => {
      if (order) {
        response.json(order);
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
PUT API
This API only handles status update. it receive 
order id from parameter and status in request body
using findByIdandUpdate we update status of the order
*/
router.put("/update-status/:id", (request, response, next) => {
  const body = request.body;
  const order = {
    status: body.status,
  };

  Order.findByIdAndUpdate(request.params.id, order, { new: true })
    .then((updatedOrder) => {
      response.json(updatedOrder);
    })
    .catch((error) => next(error));
});

/*
DELETE API
receive id as parameter and using findAndRemoveById it remove the
order drom the database
*/
router.delete("/:id", (request, response, next) => {
  Order.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

module.exports = router;
