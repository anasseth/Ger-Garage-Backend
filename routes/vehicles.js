const express = require("express");
var router = express.Router();
const Vehicle = require("../models/vehicles");
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
    Vehicle.find({}).then((parts) => {
        response.json(parts);
    });
});

router.post("/", (request, response) => {
    const body = request.body;
    if (body.name === undefined || body.manufacturer === undefined || body.type === undefined) {
        return response.status(400).json({ error: "Missing Value !" });
    }
    var vehicle = new Vehicle({
        name: body.name,
        manufacturer: body.manufacturer,
        type: body.type
    });
    vehicle.save().then((savedVehicle) => {
        response.json(savedVehicle);
    });
});

router.get("/:id", (request, response, next) => {
    Vehicle.findById(request.params.id)
        .then((vehicle) => {
            if (vehicle) {
                response.json(vehicle);
            } else {
                response.status(404).end();
            }
        })
        .catch((error) => {
            console.log(`Cannot Find Vehicle With Id ${request.params.id}`);
            console.log(error)
            next(error);
        });
});

router.delete("/:id", (request, response, next) => {
    Vehicle.findByIdAndRemove(request.params.id)
        .then((result) => {
            response.status(204).end();
        })
        .catch((error) => next(error));
});

module.exports = router;
