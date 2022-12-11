const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

app.use(express.static("build"));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const url = process.env.MONGODB_URI;

console.log("connecting to", url);
mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

var partRouter = require("./routes/parts");
var vehicleRouter = require("./routes/vehicles");
var mechanicRouter = require("./routes/mechanic");
var passwordRouter = require("./routes/password");
var bookingRouter = require("./routes/bookings");
var userRouter = require("./routes/registered_users");
var loginRouter = require("./auth/auth");

app.use("/api/part", partRouter);
app.use("/api/password", passwordRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/user", userRouter);
app.use("/api/mechanic", mechanicRouter);
app.use("/api/vehicle", vehicleRouter);
app.use("/api/login", loginRouter);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
