/*
Login Route.
This Route is used to handle New User Creation & Password Update
first we import express and then use router function from it
then importing the model function.
Request Logger function print the type of request and request body in console 
*/
const express = require("express");
var router = express.Router();
const { check, validationResult } = require("express-validator");
const passport = require("passport"); // requires passport into index.js
require("../passport/passport"); //imports passport file into index.js

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

//New user registration/Add user (POST/CREATE)
/*
POST API => Used to Create new User
First we validate request body. if there is error , we return error with 422 status code
if there is no error. We move forward and convert password into hashed form using
hashPassword function from User model/ We then search database for an existing user with same email
if exist the slready esist error is returned. Else a new user object is create and saved in database
*/
router.post("/", [], (req, res) => {
  let errors = validationResult(req); //check the validation object for errors
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  let hashedPassword = User.hashPassword(req.body.password);
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.username + " already exists");
      } else {
        User.create({
          username: req.body.username,
          password: hashedPassword,
          email: req.body.email,
        })
          .then((user) => {
            res.status(201).json(user);
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});


// Gets all users (GET/READ)
/*
GET ALL USERS API. Ths API is not used in our App so you may remove this one
This API brings all user from database
*/
router.get(
  "/",
  passport.authenticate("local", { session: false }),
  (req, res) => {
    User.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Gets user by username (GET/READ)

/*
GET SPECIFIC USERS BY USERNAME API. Ths API is not used in our App so you may remove this one
This API brings specific user from database by filtering using username
*/
router.get(
  "/:username",
  passport.authenticate("local", { session: false }),
  (req, res) => {
    User.findOne({ username: req.params.username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//Updates user info by username (PUT/UPDATE)

/*
PUT API.
This API is used to update the user information , username and password,
the api receive username as parameter. it then checks if the token send in the request header
if the token is not expired ( checked using passport.authenticate method )
we hash new password using hashpassword method from user model.
after that we search the user collection and filter data based on username received from parameter
the existing user information is replaced with new password and username
*/
router.put(
  "/:username",
  [],
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    console.log();
    console.log("Body From Server : ", req.body);
    console.log();

    let hashedPassword = User.hashPassword(req.body.password);
    console.log(hashedPassword);

    User.findOneAndUpdate(
      { username: req.params.username },
      {
        $set: {
          username: req.body.username,
          password: hashedPassword,
        },
      },
      { returnDocument: "after" }, //This line makes sure the updated document is returend
      function (err, updatedUser) {
        if (err) {
          console.error(error);
          res.status(500).send("Error: " + err);
        } else {
          console.log();
          console.log("Updated Body From Server 2: ", updatedUser);
          console.log();
          res.json(updatedUser);
        }
      }
    );
  }
);

module.exports = router;
