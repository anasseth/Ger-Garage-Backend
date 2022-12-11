const express = require("express");
var router = express.Router();
const Part = require("../models/part");
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
  Part.find({}).then((parts) => {
    response.json(parts);
  });
});

router.post("/", (request, response) => {
  const body = request.body;
  if (body.name === undefined || body.price === undefined) {
    return response.status(400).json({ error: "Name or Price is Missing" });
  }
  var part = new Part({
    name: body.name,
    manufacturer: body.manufacturer,
    price: body.price
  });
  part.save().then((savedPart) => {
    response.json(savedPart);
  });
});

router.get("/:id", (request, response, next) => {
  Part.findById(request.params.id)
    .then((part) => {
      if (part) {
        response.json(part);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      console.log(`Cannot Find Part With Id ${request.params.id}`);
      console.log(error)
      next(error);
    });
});

router.delete("/:id", (request, response, next) => {
  Part.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

module.exports = router;
