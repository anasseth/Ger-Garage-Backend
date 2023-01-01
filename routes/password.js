/*
Password Route.
This Route is used to handle Admin Login and Password Update
first we import express and then use router function from it
then importing the model function.
Request Logger function print the type of request and request body in console 
*/


const express = require("express");
var router = express.Router();
const AdminCredentials = require("../models/password");
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
GET API. This is API is nolonger needed as you don't need to get 
admin credentails from database
*/
router.get("/", (request, response) => {
  AdminCredentials.find({}).then((object) => {
    response.json(object);
  });
});

/*
POST API
When admin submit the login detail. it is received here.
if name(email) / password is undefined. we return an error
if name(email) / password donot match the name(email) & password in database
we return 400 error. else we return 200 (success) response 
*/
router.post("/", (request, response) => {
  const body = request.body;
  console.log("Body Object : ", JSON.stringify(body, undefined, 3))
  if (body.name == undefined || body.password == undefined) {
    return response.status(400).json({ error: "Name or Password is Missing" });
  }
  AdminCredentials.findOne({}, "name password", (err, credentials) => {
    console.log("Credentials : ", credentials);
    if (err) {
      response.status(400).end();
      return console.log(err);
    } else {
      if (
        credentials.name == body.name &&
        credentials.password == body.password
      ) {
        response.status(200).end();
      } else {
        response.status(400).end();
      }
    }
  });
});

/*
PUT API.
this api handles password update.
in request body we receive email and a new password
replace the existing one with the new password
*/
router.put("/:id", (request, response, next) => {
  const body = request.body;
  const adminCredentials = {
    name: body.name,
    password: body.password,
  };
  AdminCredentials.findByIdAndUpdate(request.params.id, adminCredentials, {
    new: true,
  })
    .then((updatedObject) => {
      response.json(updatedObject);
    })
    .catch((error) => next(error));
});

module.exports = router;
