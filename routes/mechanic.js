const express = require("express");
var router = express.Router();
const Mechanic = require("../models/mechanic");
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
    Mechanic.find({}).then((parts) => {
        response.json(parts);
    });
});

router.post("/", (request, response) => {
    const body = request.body;
    if (body.name === undefined || body.experienceLevel === undefined || body.servicePerDay === undefined) {
        return response.status(400).json({ error: "Missing Value !" });
    }
    var mechanic = new Mechanic({
        name: body.name,
        experienceLevel: body.experienceLevel,
        servicePerDay: body.servicePerDay
    });
    mechanic.save().then((savedMechanic) => {
        response.json(savedMechanic);
    });
});

router.get("/:id", (request, response, next) => {
    Mechanic.findById(request.params.id)
        .then((mechanic) => {
            if (mechanic) {
                response.json(mechanic);
            } else {
                response.status(404).end();
            }
        })
        .catch((error) => {
            console.log(`Cannot Find Mechanic With Id ${request.params.id}`);
            console.log(error)
            next(error);
        });
});

router.delete("/:id", (request, response, next) => {
    Mechanic.findByIdAndRemove(request.params.id)
        .then((result) => {
            response.status(204).end();
        })
        .catch((error) => next(error));
});

module.exports = router;
