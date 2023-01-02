const express = require("express");
var router = express.Router();
const transporter = require("../email/email");
const Booking = require("../models/bookings");
const User = require("../models/registered_users");
router.use(express.static("build"));

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

router.use(requestLogger);

router.get("/", (request, response) => {
  Booking.find({}).then((booking) => {
    response.json(booking);
  });
});

router.post("/", (request, response) => {
  const body = request.body;
  // console.log(request.body);
  if (!body) {
    return response.status(400).json({ error: "Booking Content Missing !" });
  }
  const booking = new Booking({
    licenseNumber: body.licenseNumber,
    initialCost: body.initialCost,
    customerNotes: body.customerNotes,
    category: body.category,
    bookingDate: body.bookingDate,
    bookingStatus: body.bookingStatus,
    mechanicAssigned: body.mechanicAssigned,
    userDetail: {
      firstName: body.userDetail.firstName,
      lastName: body.userDetail.lastName,
      address: body.userDetail.address,
      email: body.userDetail.email,
      phoneNumber: body.userDetail.phoneNumber,
    },
    vehicleDetail: {
      make: body.vehicleDetail.make,
      model: body.vehicleDetail.model,
      engineType: body.vehicleDetail.engineType,
      engineSize: body.vehicleDetail.engineSize,
    },
    paymentDetail: {
      paypal: body.paymentDetail.paypal,
      stripe: body.paymentDetail.stripe,
      creditCard: body.paymentDetail.creditCard,
      creditCardNumber: body.paymentDetail.creditCardNumber,
    },
    registeredUserData: {
      name: body.registeredUserData.name,
      email: body.registeredUserData.email,
    },
  });

  // var message = {
  //   from: "",
  //   to: booking.email,
  //   subject: "Booking Confirmation | Ger-Garage",
  //   text: `
  //   Hello ${booking.userDetail.firstName},

  //   Your Booking for ${booking.company_name} ${booking.model} has been confirmed. 

  //   Booking Details

  //   Vehicle :${body.vehicleDetail.make} ${body.vehicleDetail.type}
  //   Service Type : ${body.category}
  //   Initial Cost : ${body.initialCost}

  //   Best Regards,
  //   Ger-Garage`,
  // };

  // console.log(body);
  // console.log(booking);

  User.findOne({ username: body.registeredUserData.name, email: body.registeredUserData.email },
    function (err, user) {
      if (err) {
        console.error(error);
        res.status(500).send("Server Error : ", err);
      } else {
        console.log();
        console.log("User Exist ! : ", user);
        console.log();
        if (!user) {
          res.status(404).send("User doesn't exist. Please check your username or email");
        }
        else {
          booking
            .save()
            .then((savedBooking) => {
              response.json(savedBooking);
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
        }
      }
    });
});

router.get("/:id", (request, response, next) => {
  Booking.findById(request.params.id)
    .then((booking) => {
      if (booking) {
        response.json(booking);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      console.log(`Cannot Find The Booking For The Following Id : ${request.params.id}`);
      console.log(error);
      next(error);
    });
});

router.put("/update-status/:id", (request, response, next) => {
  const body = request.body;
  const booking = {
    bookingStatus: body.bookingStatus,
  };

  Booking.findByIdAndUpdate(request.params.id, booking, { new: true })
    .then((updateBooking) => {
      response.json(updateBooking);
    })
    .catch((error) => next(error));
});

router.put("/assign-mechanic/:id", (request, response, next) => {
  const body = request.body;
  const booking = {
    mechanicAssigned: body.mechanicAssigned,
  };

  Booking.findByIdAndUpdate(request.params.id, booking, { new: true })
    .then((updateBooking) => {
      response.json(updateBooking);
    })
    .catch((error) => next(error));
});

router.delete("/:id", (request, response, next) => {
  Booking.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

module.exports = router;
