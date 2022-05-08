/*
Auth Route.
This Route is used to handle User Login
first we import express and then use router function from it
then importing the model function.
Request Logger function print the type of request and request body in console 
*/
const jwtSecret = "your_jwt_secret"; // This has to be the same key used in the JWTStrategy
const express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken"),
  passport = require("passport");
require("../passport/passport"); // Your local passport file

router.use(express.static("build"));

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

router.use(requestLogger);

let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.username, // This is the username you’re encoding in the JWT
    expiresIn: "7d", // This specifies that the token will expire in 7 days
    algorithm: "HS256", // This is the algorithm used to “sign” or encode the values of the JWT
  });
};

/* 
POST API
First we authenticate request using JWT local strategy. if there is error or error in user object
return error message "Something is not right" .
Moving on forward, we generate JWT Token and return the user data and token as json in response body 
*/
router.post("/", (req, res) => {
  passport.authenticate("local", { session: false }, (error, user, info) => {
    if (error || !user) {
      return res.status(400).json({
        message: "Something is not right",
        user: user,
      });
    }
    req.login(user, { session: false }, (error) => {
      if (error) {
        res.send(error);
      }
      let token = generateJWTToken(user.toJSON());
      return res.json({ user, token });
    });
  })(req, res);
});

module.exports = router;
